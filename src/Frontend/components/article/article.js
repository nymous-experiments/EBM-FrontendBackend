import $ from 'jquery'

import {getArticle} from './article.service'
import {SET_ARTICLE} from './article.events'
import {articleSection} from './article.selectors'

$(document).on(SET_ARTICLE, function (event, articleId) {
  getArticle(articleId)
    .then(console.log)
  articleSection.show()
})
