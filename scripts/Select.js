import BaseComponent from "./BaseComponent.js"
import MatchMedia from "./MatchMedia.js"

const rootSelector = '[data-js-select]'

class Select extends BaseComponent {
    selectors = {
        root: rootSelector,
        originalControl: '[data-js-select-original-control]',
        button: '[data-js-select-button]',
        dropdown: '[data-js-select-dropdown]',
        option: '[data-js-select-option]',
    }

    stateClasses = {
        isExpanded: 'is-expanded',
        isSelected: 'is-selected',
        isCurrent: 'is-current',
        isOnLeftSide: 'is-on-left-side',
        isOnRightSide:'is-on-right-side',
    }

    stateAttributes = {
        ariaExpanded: 'aria-expanded',
        ariaSelected: 'aria-selected',
        ariaActiveDescendant: 'aria-activedescendant',
    }

    initialState = {
        isExpanded: false,
        currentOptionIndex: null,
        selectedOptionElement: null,
    }

    constructor(rootElement) {
        super()
        this.rootElement = rootElement
        this.originalControlElement = this.rootElement.querySelector(this.selectors.originalControl)
        this.buttonElement = this.rootElement.querySelector(this.selectors.button)
        this.dropdownElement = this.rootElement.querySelector(this.selectors.dropdown)
        this.optionElement = this.dropdownElement.querySelectorAll(this.selectors.option)
        this.state = this.getProxyState({
                ...this.initialState, 
                currentOptionIndex: this.originalControlElement.selectedIndex, 
                selectedOptionElement: this.optionElement[this.originalControlElement.selectedIndex]
        })
        this.fixDropdownPosition()
        this.updateTabIndexes()
    }

    updateUI() {
        
    }

    fixDropdownPosition() {
        const viewportWidth = document.documentElement.clientWidth
        const halfViewportX = viewportWidth / 2
        const { width, x } = this.buttonElement.getBoundingClientRect()
        const buttonCenterX = x + width / 2
        const isButtonOnLeftViewportSide = buttonCenterX < halfViewportX

        this.dropdownElement.classList.toggle(
            this.stateClasses.isOnLeftSide,
            isButtonOnLeftViewportSide
        )

        this.dropdownElement.classList.toggle(
            this.stateClasses.isOnRightSide,
            !isButtonOnLeftViewportSide
        )
    }

    updateTabIndexes() {
        const isMobileDevice = MatchMedia.mobile.matches

        this.originalControlElement.tabIndex = isMobileDevice ? 0 : -1
        this.buttonElement.tabIndex = isMobileDevice ? 0 : -1
    }
}

class SelectCollection {
    constructor() {
        this.init()
    }

    init() {
        document.querySelectorAll(rootSelector).forEach((element) => {
            new Select(element)
        })
    }
}

export default SelectCollection