export type Hint = {
	header: {
		title: string
		description: string
		icon?: string
	}
	action?: {
		key: string
		text: string
	}
	progress?: {
		title: string
		max: number
		progress: number
	}
	extra?: [
		{
			title: string
			description: string
			icon: string
		},
		{
			title: string
			description: string
			icon: string
		}
	]
}