import 'core-js/stable'
import 'regenerator-runtime/runtime'

import './assets/css/style.css'

const year: Element | any = document.querySelector('#year')
year.textContent = new Date().getFullYear().toString()
