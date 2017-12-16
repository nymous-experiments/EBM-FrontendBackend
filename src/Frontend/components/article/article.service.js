import $ from 'jquery'

/**
 * Get an article from API
 * @return {Promise<any>}
 */
export function getArticle (articleId) {
  return new Promise((resolve, reject) => {
    $.getJSON(`/api/articles/${articleId}`)
      .done((data) => resolve(data))
      .fail((error) => reject(error))
  })
}
