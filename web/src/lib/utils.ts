import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Will return whether the current environment is in a regular browser
// and not CEF
export const isEnvBrowser = (): boolean => !(window as any).invokeNative

// Basic no operation function
export const noop = () => {}

export async function fetchNui<T = any>(eventName: string, data?: any, mock?: { data: T; delay?: number }): Promise<T> {
	if (isEnvBrowser()) {
		if (!mock) return await new Promise(resolve => resolve)
		await new Promise(resolve => setTimeout(resolve, mock.delay))
		return mock.data
	}

	const options = {
		method: 'post',
		headers: {
			'Content-Type': 'application/json; charset=UTF-8',
		},
		body: JSON.stringify(data),
	}

	const resourceName = (window as any).GetParentResourceName ? (window as any).GetParentResourceName() : 'nui-frame-app'

	const resp = await fetch(`https://${resourceName}/${eventName}`, options)

	const respFormatted = await resp.json()

	return respFormatted
}

interface DebugEvent<T = unknown> {
	action: string
	data: T
}

/**
 * Emulates dispatching an event using SendNuiMessage in the lua scripts.
 * This is used when developing in browser
 *
 * @param events - The event you want to cover
 * @param timer - How long until it should trigger (ms)
 */
export const debugData = async <P>(events: DebugEvent<P>[], timer = 1000): Promise<void> => {
	if (import.meta.env.MODE === 'development' && isEnvBrowser()) {
		for (const event of events) {
			await new Promise(resolve => setTimeout(resolve, timer))
			window.dispatchEvent(
				new MessageEvent('message', {
					data: {
						action: event.action,
						data: event.data,
					},
				})
			)
		}
	}
}
