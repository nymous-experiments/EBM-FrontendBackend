import $ from 'jquery'
import 'jquery-ui/ui/widgets/sortable'
import 'jquery-ui/themes/base/core.css'
import 'jquery-ui/themes/base/sortable.css'
import 'jquery-ui/themes/base/theme.css'

import {getArticle} from '@services/article.service'
import {setParagraphOrder} from '@services/paragraphs.service'

import {SET_ARTICLE} from './article.customEvents'
import {
  handleParagraphKeydown, handleTitleKeydown, hideArticle, hideNoArticleSelectedMessage, resetParagraphs,
  resetTitle, setArticle, showSpinner
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

$(document).keydown(function (event) {
  if (event.which === 27) { // Escape
    event.preventDefault()
    resetTitle()
    resetParagraphs()
  }
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
  let target = $(event.target)
  // Check if we clicked on a paragraph, on the surrounding div or on the background between paragraphs
  if (target.is('.paragraph-container') || target.is('.article-paragraph')) {
    target = target.is('.paragraph-container') ? target : target.parent()
    const metadata = target.data('metadata')
    const textarea = $(`<textarea class="textarea article-paragraph-edition"></textarea>`).val(metadata.content)

    textarea.data('previousMetadata', metadata)
    textarea.keydown(handleParagraphKeydown)
    const toInsert = $(`<div class="paragraph-edition"></div>`).html(textarea)

    target.replaceWith(toInsert)
    textarea.focus()
  }
})

articleParagraphsContainer.sortable({
  cursor: 'move',
  placeholder: 'drag-placeholder',
  handle: '.drag-handle',
  revert: 75,
  tolerance: 'pointer',
  stop: (event, ui) => {
    event.stopPropagation()
    const paragraph = ui.item
    const paragraphId = paragraph.data('metadata').id
    const newOrder = paragraph.index() + 1 // index() is 0-based, the saved order is 1-based
    setParagraphOrder(paragraphId, newOrder)
      .catch(() => {
        alert('Something went wrong... Paragraph has been moved back to its previous position')
        articleParagraphsContainer.sortable('cancel')
      })
  }
})
