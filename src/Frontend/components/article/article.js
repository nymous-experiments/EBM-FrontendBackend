import $ from 'jquery'

import {getArticle} from '@services/article.service'

import {SET_ARTICLE} from './article.customEvents'
import {hideArticle, hideNoArticleSelectedMessage, setArticle, showSpinner} from './article.utils'
import {articleParagraphsContainer} from './article.selectors'

import {CLOSE_DROPDOWN} from '@components/navbar/navbar.customEvents'

$(document).on(SET_ARTICLE, function (event, articleId) {
  $(document).trigger(CLOSE_DROPDOWN)
  hideNoArticleSelectedMessage()
  hideArticle()
  showSpinner()
  getArticle(articleId)
    .then(setArticle)
    .catch(console.err)
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
        thisTextarea.replaceWith(paragraphToReplace)
      }
    })

    const toInsert = $(`<div></div>`).html(textarea)
    target.replaceWith(toInsert)

    textarea.focus()
  }
})
