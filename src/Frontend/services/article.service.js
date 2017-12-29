import $ from 'jquery'

/**
 * Get all articles from API
 * @return {Promise<any>}
 */
export function listArticles () {
  return new Promise((resolve, reject) => {
    $.getJSON('/api/articles')
      .done((data) => resolve(data))
      .fail((error) => reject(error))
  })
}

/**
 * Get an article from API
 * @param articleId {int} Article ID
 * @return {Promise<any>}
 */
export function getArticle (articleId) {
  return new Promise((resolve, reject) => {
    $.getJSON(`/api/articles/${articleId}`)
      .done((data) => resolve(data))
      .fail((error) => reject(error))
  })
}
