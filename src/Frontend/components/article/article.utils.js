import $ from 'jquery'

import {
  articleParagraphsContainer, articleSection, articleSpinner, articleTitle,
  noArticleSelectedMessage
} from './article.selectors'

export function setArticle (article) {
  articleTitle.text(article.title)
  articleTitle.data('metadata', {
    id: article.id,
    title: article.title
  })
  articleParagraphsContainer.empty()
  let paragraphs = []
  if (article.paragraphs) {
    article.paragraphs.forEach(paragraph => {
      const paragraphToInsert = $(`<p class="article-paragraph">${paragraph.content}</p>`)
      paragraphToInsert.data('metadata', {id: paragraph.id, content: paragraph.content, order: paragraph.order})
      paragraphs.push(paragraphToInsert)
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
