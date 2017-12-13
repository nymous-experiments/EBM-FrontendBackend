import $ from 'jquery'

/**
 * Get all articles from API
 * @return {Promise<any>}
 */
export function getArticles () {
  return new Promise((resolve, reject) => {
    $.getJSON('/api/articles')
      .done((data) => resolve(data))
      .fail((error) => reject(error))
  })
}
