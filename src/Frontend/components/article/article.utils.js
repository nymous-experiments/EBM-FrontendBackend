import $ from 'jquery'

import {
  articleParagraphsContainer, articleSection, articleSpinner, articleTitle,
  noArticleSelectedMessage
} from './article.selectors'

export function setArticle (article) {
  articleTitle.text(article.title)
  articleParagraphsContainer.empty()
  let paragraphs = []
  if (article.paragraphs) {
    article.paragraphs.forEach(paragraph => {
      paragraph.push($(`<p class="article-paragraph">${paragraph.content}</p>`))
    })
    articleParagraphsContainer.append(paragraphs)
  }
  hideSpinner()
  showArticle()
}

export function showSpinner () {
  articleSpinner.css('display', 'flex')
}

export function hideSpinner () {
  articleSpinner.hide()
}

export function showArticle () {
  articleSection.show()
}

export function hideArticle () {
  articleSection.hide()
}

export function showNoArticleSelectedMessage () {
  noArticleSelectedMessage.show()
}

export function hideNoArticleSelectedMessage () {
  noArticleSelectedMessage.hide()
}
