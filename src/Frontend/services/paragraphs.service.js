import $ from 'jquery'

/**
 * Update text for a paragraph
 * @param paragraphId {int} Paragraph ID
 * @param content {string} New text
 * @return {Promise<any>}
 */
export function setParagraphContent (paragraphId, content) {
  return new Promise((resolve, reject) => {
    $.ajax(`/api/paragraphs/${paragraphId}`, {
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({
        content: content
      })
    })
      .done(data => resolve(data))
      .fail(error => reject(error))
  })
}

export function setParagraphOrder (paragraphId, newOrder) {
  return new Promise((resolve, reject) => {
    $.ajax(`/api/paragraphs/${paragraphId}`, {
      method: 'PATCH',
      contentType: 'application/json',
      data: JSON.stringify({
        order: newOrder
      })
    })
      .done(data => resolve(data))
      .fail(error => reject(error))
  })
}

export function createParagraph (articleId) {
  return new Promise((resolve, reject) => {
    $.ajax(`/api/articles/${articleId}/paragraphs`, {
      method: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({
        content: ''
      })
    })
      .done(data => resolve(data))
      .fail(error => reject(error))
  })
}
