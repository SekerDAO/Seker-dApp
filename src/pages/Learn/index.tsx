import React, {Fragment, FunctionComponent} from "react"
import "./styles.scss"
import LearnMenu from "../../components/LearnMenu"
import LEARN_ARTICLES from "../../constants/learnArticles"

const Learn: FunctionComponent = () => (
	<div className="learn">
		<LearnMenu entries={LEARN_ARTICLES} />
		<div className="learn__articles">
			{LEARN_ARTICLES.map((lv0Article, lv0Index) => (
				<Fragment key={lv0Index}>
					<h1 id={`learn_0_${lv0Index}`}>{lv0Article.title}</h1>
					{lv0Article.articles.map((article, idx) => (
						<p key={idx}>{article}</p>
					))}
					{lv0Article.childArticles.map((lv1Article, lv1Index) => (
						<Fragment key={lv1Index}>
							<h2 id={`learn_1_${lv1Index}`}>{lv1Article.title}</h2>
							{lv1Article.articles.map((article, idx) => (
								<p key={idx}>{article}</p>
							))}
							{lv1Article.childArticles.map((lv2Article, lv2Index) => (
								<Fragment key={lv2Index}>
									<h3 id={`learn_2_${lv2Index}`}>{lv2Article.title}</h3>
									{lv2Article.articles.map((article, idx) => (
										<p key={idx}>{article}</p>
									))}
								</Fragment>
							))}
						</Fragment>
					))}
				</Fragment>
			))}
		</div>
	</div>
)

export default Learn
