import $ from 'jquery'

import {getArticle} from '@services/article.service'

import {SET_ARTICLE} from './article.customEvents'
import {hideArticle, hideNoArticleSelectedMessage, setArticle, showSpinner} from './article.utils'

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
