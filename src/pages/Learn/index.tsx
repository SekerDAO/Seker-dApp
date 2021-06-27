import React, {Fragment, FunctionComponent} from "react"
import "./styles.scss"
import LearnMenu from "../../components/LearnMenu"
import LEARN_ARTICLES from "../../constants/learnArticles"
import {useLocation} from "react-router-dom"

const Learn: FunctionComponent = () => {
	const {hash} = useLocation()
	const activeArticleIndex = hash ? Number(hash.split("_")[1]) : 0
	const activeArticle = LEARN_ARTICLES[activeArticleIndex]

	return (
		<div className="learn">
			<LearnMenu entries={LEARN_ARTICLES} />
			<div className="learn__articles">
				<h1 id={`learn_${activeArticleIndex}`}>{activeArticle.title}</h1>
				{activeArticle.articles.map((article, idx) => (
					<p key={idx}>{article}</p>
				))}
				{activeArticle.childArticles.map((lv1Article, lv1Index) => (
					<Fragment key={lv1Index}>
						<h2 id={`learn_${activeArticleIndex}_${lv1Index}`}>{lv1Article.title}</h2>
						{lv1Article.articles.map((article, idx) => (
							<p key={idx}>{article}</p>
						))}
						{lv1Article.childArticles.map((lv2Article, lv2Index) => (
							<Fragment key={lv2Index}>
								<h3 id={`learn_${activeArticleIndex}_${lv1Index}_${lv2Index}`}>{lv2Article.title}</h3>
								{lv2Article.articles.map((article, idx) => (
									<p key={idx}>{article}</p>
								))}
							</Fragment>
						))}
					</Fragment>
				))}
			</div>
		</div>
	)
}

export default Learn
