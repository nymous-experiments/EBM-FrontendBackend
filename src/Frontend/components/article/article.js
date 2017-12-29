import $ from 'jquery'

import {getArticle} from '@services/article.service'

import {SET_ARTICLE} from './article.customEvents'
import {
  handleParagraphKeydown, handleTitleKeydown, hideArticle, hideNoArticleSelectedMessage, setArticle,
  showSpinner
} from './article.utils'
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
  // Avoid firing the event once the title has been replace with the input
  if (target.is('h1')) {
    const metadata = target.data('metadata')
    const textInput = $(`<input class="input title" type="text">`).val(metadata.title)

    textInput.data('previousMetadata', metadata)
    textInput.keydown(handleTitleKeydown)

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
    textarea.keydown(handleParagraphKeydown)
    const toInsert = $(`<div></div>`).html(textarea)

    target.replaceWith(toInsert)
    textarea.focus()
  }
})
