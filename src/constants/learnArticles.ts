import {Learn} from "../types/learn"

const LEARN_ARTICLES: Learn = [
	{
		title: "Introduction",
		articles: [
			`Welcome to the Hyphal V0 documentation. These pages will thoroughly outline the Hyphal ecosystem. If you are new here, we recommend starting with the high-level overview below.`,

			`For step-by-step guides, jump to Getting Started.`,

			`For developers interested in using our tools to create their own dApps or build upon Zodiac or Hyphal, Jump to the developers sections and you can find all of our code here:`,
			`<a href="https://github.com/Hyphal" target="_blank" rel="noopener noreferrer">https://github.com/Hyphal</a>`
		],
		childArticles: []
	},
	{
		title: "What Is the Hyphal dApp?",
		articles: [
			`Hyphal is a dApp to help you boot up, list, and operate your DAO! We have collaborated with Gnosis Guild on building the Zodiac Module, and have developed the Usul Module to help you achieve an unstoppable organization.`,

			`The Hyphal dApp is catered to DAOs of all types, with the intention of building a vibrant ecosystem of communities that fosters new financial opportunities, collaborations, expression, and growth — implemented as mutually beneficial networks of DAOs.`
		],
		childArticles: [
			{
				title: "Zodiac Modules",
				articles: [
					`Zodiac modules are at the core of your DAOs infrastructure. For more information on Zodiac [article link coming soon].`,
					`With the Hyphal dApp you will be able to choose to use all or some of the following Zodiac compliant modules and modifiers.`,
					`<ul>
						<li>Usul: allows avatars to operate with trustless tokenized DeGov, similar to Compound or Gitcoin, with a time-boxed proposal core that can register swappable voting contracts, allowing DAOs to choose from various on-chain voting methods that best suit their needs. (Built by Hyphal)</li>
						<li>Exit: allows users to redeem a designated token for a relative share of an avatars assets, similar to Moloch's infamous rageQuit() function. (Built by Gnosis Guild)</li>
						<li>Bridge: allows an address on one chain to control an avatar on another chain, via an arbitrary message bridge. (Built by Gnosis Guild)</li>
						<li>Reality: allows on-chain execution based on the outcome of events reported by Reality.eth. Used to build the SafeSnap module for Snapshot. (Built by Gnosis Guild)</li>
					</ul>`,
					`More to come...`
				],
				childArticles: []
			},
			{
				title: "Zodiac Modifiers",
				articles: [
					`<ul>
						<li>Delay: allows avatars to enforce a time delay between when a module initiates a transaction and when it will be executed by the avatar. (Built by Gnosis Guild)</li>
					</ul>`
				],
				childArticles: [
					{
						title: "Voting Modifiers",
						articles: [
							`<ul>
								<li>Linear Voting ERC20 + delegation</li>
								<li>Linear Voting ERC20 + Membership</li>
								<li>Quadratic Voting ERC20 + Membership</li>
								<li>Single Voting</li>
								<li>Commitment ERC20 Voting</li>
							</ul>`,
							`We are building more modules and modifiers that extend the Zodiac ecosystem, such as exhibits and secure DeGov options to deal with issues like bribery. These novel extensions give rise to a new possibility of DAO implementations that allows for a progressive path to decentralization or to specific needs catered to any type of DAO.`
						]
					}
				]
			},
			{
				title: "Gas Costs",
				articles: [
					`Gas costs present another challenge to large-scale on-chain voting, and examples exist for maintaining off-chain voting in a transparent way (e.g. Snapshot). While these solutions are cheap, they do introduce trust issues in the form of oracles. However, given that our dApp uses Zodiac Avatars as the asset manager core, our communities can continue to make use of SnapShot with the Reality module.`,

					`While DAOs are in the early stages of development, there will likely not be many of the known issues present in DeGov. We believe that the best first step forward for DAOs moving to a cost effective trustless form of DeGov will be with delegation voting methods in the Usul module.`,

					`If the user friction challenges are acceptable, DAOs can use Usul in conjunction with the Bridge module on a sidechain like xDAI. (Coming soon).`
				],
				childArticles: []
			}
		]
	},
	{
		title: "What Is the HyphalDAO?",
		articles: [
			`HyphalDAO is committed to ensuring that creators can release their work as public goods, meaning that they no longer need to create paywalls, rely on secondary market speculators to provide unfair royalties, or treat their work like commodities. HyphalDAO is shifting the focus of digital content away from solely belonging to marketplaces or auction houses.`,
			`To achieve this, we have structured HyphalDAO to be a retroactive public goods funding oracle similar to Optimism’s DAO. We have committed to using the HyphalDAOs treasury to support a landscape of creators that have shown a history of producing art, music, or any content that enriches humanity as a public good. This oracle provides a new possibility of museums of digital content — providing alternative solutions for how that content is funded, exhibited, as well as collected.`,
			`HyphalDAO is a community dedicated to helping other DAOs boot up with the tools we have created with Gnosis. Feel free to join our discord if you have any questions or would like more general, technical, or legal help.`
		],
		childArticles: []
	},
	{
		title: "Getting Started (Guides)",
		articles: [`Coming Soon!`],
		childArticles: []
	},
	{
		title: "Developers",
		articles: [`Coming Soon!`],
		childArticles: [
			{
				title: "Smart Contracts",
				articles: [`Coming Soon!`],
				childArticles: [
					{
						title: "Avatars",
						articles: [`Coming Soon!`]
					},
					{
						title: "Usul Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Roles Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Delay Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Exit Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Reality Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Marketplace Extension Module",
						articles: [`Coming Soon!`]
					},
					{
						title: "Exhibit Extension Module",
						articles: [`Coming Soon!`]
					}
				]
			},
			{
				title: "ABI Files",
				articles: [`Coming Soon!`],
				childArticles: []
			},
			{
				title: "Interfaces",
				articles: [`Coming Soon!`],
				childArticles: []
			},
			{
				title: "Developer Tools",
				articles: [`Coming Soon!`],
				childArticles: []
			},
			{
				title: "API",
				articles: [`Coming Soon!`],
				childArticles: []
			},
			{
				title: "Deployment Specifics",
				articles: [`Coming Soon!`],
				childArticles: []
			}
		]
	}
]

export default LEARN_ARTICLES
