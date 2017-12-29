import $ from 'jquery'

import {getArticle, setArticleTitle} from '@services/article.service'
import {setParagraphContent} from '@services/paragraphs.service'

import {SET_ARTICLE} from './article.customEvents'
import {hideArticle, hideNoArticleSelectedMessage, setArticle, showSpinner} from './article.utils'
import {articleParagraphsContainer, articleTitle} from './article.selectors'

$(document).on(SET_ARTICLE, function (event, articleId) {
  hideNoArticleSelectedMessage()
  hideArticle()
  showSpinner()
  getArticle(articleId)
    .then(setArticle)
    .catch(console.err)
})

articleTitle.click(function (event) {
  const target = $(event.target)
  if (target.is('h1')) {
    const metadata = target.data('metadata')
    const textInput = $(`<input class="input title" type="text">`).val(metadata.title)
    textInput.data('previousMetadata', metadata)
    textInput.keydown(function (event) {
      if (event.which === 13) { // Enter
        const thisTextinput = $(event.target)
        const newTitle = thisTextinput.val()
        const newMetadata = Object.assign({}, thisTextinput.data('previousMetadata'), {title: newTitle})
        const titleToReplace = $(`<h1 class="title">${newTitle}</h1>`)
        titleToReplace.data('metadata', newMetadata)
        setArticleTitle(newMetadata.id, newTitle)
          .then(() => thisTextinput.replaceWith(titleToReplace))
          .catch(err => console.error(err)) // TODO Handle error
      }
    })
    target.html(textInput)
    textInput.focus()
  }
})

articleParagraphsContainer.click(function (event) {
  const target = $(event.target)
  // Check if we clicked on a paragraph on on the background between paragraphs
  if (target.is('p')) {
    const metadata = target.data('metadata')
    const textarea = $(`<textarea class="textarea article-paragraph"></textarea>`).val(metadata.content)
    textarea.data('previousMetadata', metadata)

    textarea.keydown(function (event) {
      if (event.which === 13) { // Enter
        const thisTextarea = $(event.target)
        const newContent = thisTextarea.val()
        const newMetadata = Object.assign({}, thisTextarea.data('previousMetadata'), {content: newContent})
        const paragraphToReplace = $(`<p class="article-paragraph" data-order="${newMetadata.order}">${newContent}</p>`)
        paragraphToReplace.data('metadata', newMetadata)
        setParagraphContent(newMetadata.id, newContent)
          .then(() => thisTextarea.replaceWith(paragraphToReplace))
          .catch(err => console.error(err)) // TODO Handle error
      }
    })

    const toInsert = $(`<div></div>`).html(textarea)
    target.replaceWith(toInsert)

    textarea.focus()
  }
})
