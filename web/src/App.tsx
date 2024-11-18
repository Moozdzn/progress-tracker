import './App.css'
import { type Theme, useTheme } from './components/theme-provider'
import { Badge } from './components/ui/badge'
import { Card, CardTitle, CardDescription, CardContent } from './components/ui/card'
import { Progress } from './components/ui/progress'
import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ModeToggle } from './components/mode-toggle'
import { cn, fetchNui, isEnvBrowser } from './lib/utils'
import { useNuiEvent } from './hooks/useNuiEvent'
import { backgroundColorVariants, textColorVariants } from './lib/colors'
import { cardPositions } from './lib/positions'
import type { Hint } from './types'
import { debug } from './lib/dev'

function App() {
	const [visible, setVisible] = useState(isEnvBrowser())
	const [hint, setHint] = useState<Hint>({
		header: {
			title: "Hello, I'm the title",
			description: "Hello, I'm the description",
			icon: 'fa-envelope',
		},
	})
	const [hideKey, setHideKey] = useState('h')
	const [open, setOpen] = useState(true)
	const [primaryColor, setPrimaryColor] = useState<keyof typeof textColorVariants>('blue')
	const [position, setPosition] = useState(cardPositions.left)
	const { setTheme } = useTheme()

	useEffect(() => {
		fetchNui<{ color: keyof typeof textColorVariants; position: keyof typeof cardPositions; colorScheme: Theme }>(
			'uiLoaded',
			{},
			{ data: { color: 'orange', position: 'left', colorScheme: 'dark' }, delay: 1000 }
		).then(({ color, position, colorScheme }) => {
			setPrimaryColor(color)
			setPosition(cardPositions[position])
			setTheme(colorScheme)
		})

		if (isEnvBrowser()) {
			debug()
		}
	}, [])

	useEffect(() => {
		if (!isEnvBrowser()) return

		const onKeyDown = (e: KeyboardEvent) => {
			if (e.key === hideKey) {
				setOpen(false)
			}
		}

		window.addEventListener('keydown', onKeyDown)

		return () => window.removeEventListener('keydown', onKeyDown)
	}, [hideKey])

	useNuiEvent<Hint>('registerHint', data => {
		setHint(data)
	})

	useNuiEvent<string>('show', data => {
		setVisible(true)
		setHideKey(data)
		setOpen(true)
	})

	useNuiEvent('hide', () => setVisible(false))

	useNuiEvent<string>('toggle', data => {
		setOpen(prev => !prev)
		setHideKey(data)
	})

	useNuiEvent<Theme>('setTheme', data => setTheme(data))

	return (
		<>
			{isEnvBrowser() && <ModeToggle />}
			{visible && (
				<>
					<AnimatePresence>
						{open && (
							<motion.div
								initial={{ scale: 0.3 }}
								animate={{ scale: 1 }}
								transition={{ duration: 0.5 }}
								exit={{ scale: 0.1, opacity: 0.5 }}
								className={`absolute ${position.card}`}
							>
								<Card className={cn('absolute w-[20vw] rounded-s-lg rounded-e-none', position.card)}>
									<Badge
										className={cn(
											`absolute z-10 font-bold ${position.hideButton} -top-4 text-xl shadow-inner text-white dark:text-black`,
											backgroundColorVariants[primaryColor]
										)}
										variant='secondary'
									>
										{hideKey.toUpperCase()}
									</Badge>
									<CardContent className='py-4 px-5'>
										<div className='flex relative items-center'>
											{hint.header.icon && (
												<div className='relative rounded-md flex justify-center items-center p-[0.25vw] mr-[0.75vw] h-[2.5vw] w-[2.5vw] text-[2vw]'>
													<i className={cn('fa-solid', hint.header.icon, textColorVariants[primaryColor])} />
												</div>
											)}
											<div className='flex-1 w-full '>
												<CardTitle className={cn('text-lg font-bold', textColorVariants[primaryColor])}>
													{hint.header.title}
												</CardTitle>
												{hint.header.description && (
													<CardDescription className='text-sm '>{hint.header.description}</CardDescription>
												)}
											</div>
										</div>
										{hint.action && (
											<>
												<Badge className={`font-bold text-base mr-2 ${textColorVariants[primaryColor]}`} variant='outline'>
													{hint.action.key.toUpperCase()}
												</Badge>
												{hint.action.text && <span className='text-sm'>{hint.action.text}</span>}
											</>
										)}

										{hint.progress && (
											<>
												<div className='flex justify-between items-center py-1'>
													{hint.progress.title && <span className='text-md'>{hint.progress.title}</span>}
													<span className={cn('text-lg font-bold', textColorVariants[primaryColor])}>
														{hint.progress.progress}/{hint.progress.max}
													</span>
												</div>
												<Progress
													value={(hint.progress.progress / hint.progress.max) * 100}
													className={backgroundColorVariants[primaryColor]}
												/>
											</>
										)}

										{hint.extra && (
											<div className='flex justify-between pt-4'>
												{hint.extra.map(extra => (
													<div key={extra.title} className='flex relative items-center'>
														<div className='relative flex justify-center items-center p-[0.25vw] mr-[0.75vw] h-[1.5vw] w-[1.5vw] text-[1vw]'>
															<i className={cn('fa-solid text-2xl', extra.icon, textColorVariants[primaryColor])} />
														</div>
														<div className='flex-1 w-full'>
															<p className={cn('text-lg font-bold', textColorVariants[primaryColor])}>{extra.title}</p>
															<CardDescription className='text-sm '>{extra.description}</CardDescription>
														</div>
													</div>
												))}
											</div>
										)}
									</CardContent>
								</Card>
							</motion.div>
						)}
					</AnimatePresence>

					{!open && (
						<motion.div
							className={`absolute ${position.showButton}`}
							initial={{ scale: 0 }}
							animate={{ scale: 1 }}
							transition={{ duration: 0.5 }}
						>
							<div
								className={`absolute ${position.showButton} w-[20vw] p-[1.45vw] h-[1.5vw] max-w-[0.6vw] flex justify-center items-center bg-card`}
							>
								<div className='relative text-[1.1vw]'>{hideKey.toUpperCase()}</div>
							</div>
						</motion.div>
					)}
				</>
			)}
		</>
	)
}

export default App
