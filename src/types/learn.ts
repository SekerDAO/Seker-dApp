type LearnArticleLv2 = {
	title: string
	articles: string[]
}

type LearnArticleLv1 = {
	title: string
	articles: string[]
	childArticles: LearnArticleLv2[]
}

type LearnArticleLv0 = {
	title: string
	articles: string[]
	childArticles: LearnArticleLv1[]
}

export type Learn = LearnArticleLv0[]
