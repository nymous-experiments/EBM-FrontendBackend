import $ from 'jquery'

import {listArticles} from '@services/article.service'

import {closeDropdown, isDropdownOpen, setArticlesList, showSpinner, toggleDropdown} from './navbar.utils'
import {body, dropdownMenu, navbarDropdown} from './navbar.selectors'
import {CLOSE_DROPDOWN} from './navbar.customEvents'

import {SET_ARTICLE} from '@components/article/article.customEvents'

dropdownMenu.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  if (!isDropdownOpen()) {
    showSpinner()
    listArticles()
      .then(setArticlesList)
      .catch(console.error) // TODO
  }
  toggleDropdown()
})

navbarDropdown.click(function (event) {
  event.preventDefault()
  event.stopPropagation()
  const target = $(event.target)
  if (target.is('a')) {
    const articleId = event.target.dataset.id
    $(document).trigger(SET_ARTICLE, articleId)
  }
})

$(document).on(CLOSE_DROPDOWN, function (event) {
  event.stopPropagation()
  event.preventDefault()
  closeDropdown()
})

body.click(function (event) {
  closeDropdown()
})
