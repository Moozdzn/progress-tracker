import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { isEnvBrowser } from './lib/utils.ts'
import { ThemeProvider } from './components/theme-provider.tsx'

if (isEnvBrowser()) {
	const root = document.getElementById('root')
	// https://i.imgur.com/vDGEfYg.png - Night time img
	root!.style.backgroundImage = 'url("https://i.imgur.com/iPTAdYV.jpeg")'
	root!.style.backgroundSize = 'cover'
	root!.style.backgroundRepeat = 'no-repeat'
	root!.style.backgroundPosition = 'center'
}


createRoot(document.getElementById('root')!).render(
  <StrictMode>
		<ThemeProvider defaultTheme='dark'>
			<App />
		</ThemeProvider>
  </StrictMode>,
)
