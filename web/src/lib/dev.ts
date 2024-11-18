import { debugData } from "./utils";

export const debug = () =>
	setTimeout(
		() =>
			debugData([
				{
					action: 'RegisterHint',
					data: {
						header: {
							title: "Hello, I'm the title",
							description: "Hello, I'm the description",
							icon: 'fa-envelope',
						},
						action: {
							key: 'e',
							text: 'Toggle Hint',
						},
						progress: {
							title: 'Progress',
							max: 100,
							progress: 50,
						},
						extra: [
							{
								title: 'Extra 1',
								description: 'Extra 1 description',
								icon: 'fa-envelope',
							},
							{
								title: 'Extra 2',
								description: 'Extra 2 description',
								icon: 'fa-envelope',
							},
						],
					},
				},
				{
					action: 'show',
					data: {
						hideKey: 'P',
					},
				},
				{
					action: 'setHeader',
					data: {
						title: "Hello, I'm the description",
						description: "Hello, I'm the title",
						icon: 'fa-envelope',
					},
				},
				{
					action: 'setAction',
					data: {
						key: 'M',
						text: 'Hint Toggle',
					},
				},
				{
					action: 'setProgress',
					data: {
						title: 'Progress',
						max: 100,
						progress: 60,
					},
				},
				{
					action: 'setProgress',
					data: {
						title: 'Almost there',
						max: 100,
						progress: 95,
					},
				},
				{
					action: 'setExtra',
					data: [
						{
							title: 'Extra 2',
							description: 'Extra 1 description',
							icon: 'fa-envelope',
						},
						{
							title: 'Extra 1',
							description: 'Extra 2 description',
							icon: 'fa-envelope',
						},
					],
				},
			]),
		2000
	)