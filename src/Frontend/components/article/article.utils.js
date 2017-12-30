import $ from 'jquery'

import {
  articleParagraphsContainer, articleSection, articleSpinner, articleTitle,
  noArticleSelectedMessage
} from './article.selectors'
import {setArticleTitle} from '@services/article.service'
import {createParagraph, setParagraphContent} from '@services/paragraphs.service'

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
      const paragraphToInsert = newParagraph(paragraph.content)
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

function handleTitleKeydown (event) {
  if (event.which === 13) { // Enter
    event.preventDefault()
    const thisTextinput = $(event.target)
    const newTitle = thisTextinput.val()
    const newMetadata = Object.assign({}, thisTextinput.data('previousMetadata'), {title: newTitle})
    articleTitle.data('metadata', newMetadata)
    setArticleTitle(newMetadata.id, newTitle)
      .then(() => articleTitle.html(newTitle))
      .catch(err => console.error(err)) // TODO Handle error
  }
}

function handleParagraphKeydown (event) {
  if (event.which === 13) { // Enter
    event.preventDefault()
    const thisTextarea = $(event.target)
    const newContent = thisTextarea.val()
    const newMetadata = Object.assign({}, thisTextarea.data('previousMetadata'), {content: newContent})
    const paragraphToReplace = newParagraph(newContent)
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
    if (paragraph.is('.paragraph-edition')) { // Paragraph is being edited
      const metadata = paragraph.children().data('previousMetadata')
      const paragraphToReplace = newParagraph(metadata.content)
      paragraphToReplace.data('metadata', metadata)
      paragraph.replaceWith(paragraphToReplace)
    }
  })
}

export function addParagraph () {
  createParagraph(articleTitle.data('metadata').id)
    .then(paragraph => {
      const addedParagraph = newParagraph().data('metadata', {content: '', id: paragraph.id})
      articleParagraphsContainer.append(addedParagraph)
      $('html').scrollTop(addedParagraph.offset().top)
      editParagraph(addedParagraph)
    })
    .catch(err => console.error(err)) // TODO Handle error
}

export function editParagraph (target) {
  const metadata = target.data('metadata')
  const textarea = $(`<textarea class="textarea article-paragraph-edition"></textarea>`).val(metadata.content)

  textarea.data('previousMetadata', metadata)
  textarea.keydown(handleParagraphKeydown)
  const toInsert = $(`<div class="paragraph-edition"></div>`).html(textarea)

  target.replaceWith(toInsert)
  textarea.focus()
}

export function editTitle (target) {
  const metadata = target.data('metadata')
  const textInput = $(`<input class="input title" type="text">`).val(metadata.title)

  textInput.data('previousMetadata', metadata)
  textInput.keydown(handleTitleKeydown)

  target.html(textInput)
  textInput.focus()
}

function newParagraph (content = '') {
  return $(`<div class="paragraph-container">
    <p class="article-paragraph">${content}</p>
    <span class="icon is-medium drag-handle"><i class="fa fa-lg fa-border fa-fw fa-sort"></i></span>
</div>`)
}
