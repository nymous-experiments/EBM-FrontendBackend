import $ from 'jquery'

import {
  articleParagraphsContainer, articleSection, articleSpinner, articleTitle,
  noArticleSelectedMessage
} from './article.selectors'
import {setArticleTitle} from '@services/article.service'
import {setParagraphContent} from '@services/paragraphs.service'

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
      paragraphToInsert.data('metadata', {id: paragraph.id, content: paragraph.content})
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

export function handleTitleKeydown (event) {
  if (event.which === 13) { // Enter
    const thisTextinput = $(event.target)
    const newTitle = thisTextinput.val()
    const newMetadata = Object.assign({}, thisTextinput.data('previousMetadata'), {title: newTitle})
    articleTitle.data('metadata', newMetadata)
    setArticleTitle(newMetadata.id, newTitle)
      .then(() => articleTitle.html(newTitle))
      .catch(err => console.error(err)) // TODO Handle error
  }
}

export function handleParagraphKeydown (event) {
  if (event.which === 13) { // Enter
    const thisTextarea = $(event.target)
    const newContent = thisTextarea.val()
    const newMetadata = Object.assign({}, thisTextarea.data('previousMetadata'), {content: newContent})
    const paragraphToReplace = $(`<p class="article-paragraph">${newContent}</p>`)
    paragraphToReplace.data('metadata', newMetadata)
    setParagraphContent(newMetadata.id, newContent)
      .then(() => thisTextarea.parent().replaceWith(paragraphToReplace)) // Replace the wrapping div
      .catch(err => console.error(err)) // TODO Handle error
  }
}

export function resetTitle () {
  if (articleTitle.children().length > 0) { // The title has an input inside
    const metadata = articleTitle.data('metadata')
    articleTitle.html(metadata.title)
  }
}

export function resetParagraphs () {
  articleParagraphsContainer.children().each(function () {
    const paragraph = $(this)
    if (paragraph.is('div')) { // Paragraph is being edited
      const metadata = paragraph.children().data('previousMetadata')
      const paragraphToReplace = $(`<p class="article-paragraph">${metadata.content}</p>`)
      paragraphToReplace.data('metadata', metadata)
      paragraph.replaceWith(paragraphToReplace)
    }
  })
}
