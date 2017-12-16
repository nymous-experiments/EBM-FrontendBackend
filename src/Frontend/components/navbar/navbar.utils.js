import $ from 'jquery'

import {navbarDropdown} from './navbar.selectors'

export function showSpinner () {
  navbarDropdown.empty()
  navbarDropdown.append(
    $(`<div class="custom-spinner-container"><span class="custom-spinner"></span></div>`)
  )
}

export function setArticlesList (data) {
  navbarDropdown.empty()
  data.forEach((article) => {
    navbarDropdown.append(
      $(`<a href="#" class="navbar-item" data-id="${article.id}">${article.title}</a>`)
    )
  })
}
