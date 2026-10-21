import './style.css'

document.querySelector('#app').innerHTML = `
<button class="save-button" type="button">Save</button>
<div class="grid">
    <div class="cell"><h2 class="cell-header" contenteditable="false">FACTS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">MERITS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">PEOPLE</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">THOUGHTS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">FOCUS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">ACTIONS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">FEELINGS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">NEEDS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="cell"><h2 class="cell-header" contenteditable="false">TOPICS</h2><div class="cell-content" contenteditable="false"></div></div>
    <div class="gutter-col gutter-col-1" data-track="1"></div>
    <div class="gutter-col gutter-col-3" data-track="3"></div>
    <div class="gutter-row gutter-row-1" data-track="1"></div>
    <div class="gutter-row gutter-row-3" data-track="3"></div>
</div>
`

function initializeSavedCopy() {
    const grid = document.querySelector('.grid')
    const saveButton = document.querySelector('.save-button')
    const cells = Array.from(document.querySelectorAll('.cell-content'))
    const gutters = Array.from(document.querySelectorAll('.gutter-col, .gutter-row'))
    let initialContent = cells.map((cell) => cell.innerHTML)

    function getStyles() {
        return Array.from(document.styleSheets).map((styleSheet) => {
            try {
                return Array.from(styleSheet.cssRules, (rule) => rule.cssText).join('\n')
            } catch {
                return ''
            }
        }).join('\n')
    }

    function getDividerPositions() {
        const gridBounds = grid.getBoundingClientRect()
        return gutters.map((gutter) => {
            const bounds = gutter.getBoundingClientRect()
            const isColumn = gutter.classList.contains('gutter-col')
            return isColumn
                ? (bounds.left + bounds.width / 2 - gridBounds.left) / gridBounds.width
                : (bounds.top + bounds.height / 2 - gridBounds.top) / gridBounds.height
        })
    }

    function resizeGrid() {
        const { width, height } = grid.getBoundingClientRect()
        const [leftColumn, rightColumn, topRow, bottomRow] = dividerPositions
        const columnSizes = [
            Math.max(0, leftColumn * width - 4),
            Math.max(0, (rightColumn - leftColumn) * width - 8),
            Math.max(0, (1 - rightColumn) * width - 4),
        ]
        const rowSizes = [
            Math.max(0, topRow * height - 4),
            Math.max(0, (bottomRow - topRow) * height - 8),
            Math.max(0, (1 - bottomRow) * height - 4),
        ]
        grid.style.gridTemplateColumns = `${columnSizes[0]}fr 8px ${columnSizes[1]}fr 8px ${columnSizes[2]}fr`
        grid.style.gridTemplateRows = `${rowSizes[0]}fr 8px ${rowSizes[1]}fr 8px ${rowSizes[2]}fr`
        dividerPositions = getDividerPositions()
    }

    let dividerPositions = getDividerPositions()
    const savedViewportWidth = Number(grid.dataset.viewportWidth)
    const savedViewportHeight = Number(grid.dataset.viewportHeight)
    const savedDividerPositions = grid.dataset.dividerPositions?.split(',').map(Number)
    if (
        savedViewportWidth !== window.innerWidth ||
        savedViewportHeight !== window.innerHeight
    ) {
        if (savedDividerPositions?.length === gutters.length && savedDividerPositions.every(Number.isFinite)) {
            dividerPositions = savedDividerPositions
            resizeGrid()
        }
    }
    let initialDividerPositions = getDividerPositions()

    function updateSaveButton() {
        const contentChanged = cells.some((cell, index) => cell.innerHTML !== initialContent[index])
        const currentDividerPositions = getDividerPositions()
        const dividersChanged = currentDividerPositions.some((position, index) => {
            const size = gutters[index].classList.contains('gutter-col')
                ? grid.clientWidth
                : grid.clientHeight
            return Math.abs(position - initialDividerPositions[index]) * size > 1
        })
        saveButton.disabled = !contentChanged && !dividersChanged
    }

    function downloadPage() {
        const copy = document.documentElement.cloneNode(true)
        const copyGrid = copy.querySelector('.grid')
        copyGrid.dataset.viewportWidth = String(window.innerWidth)
        copyGrid.dataset.viewportHeight = String(window.innerHeight)
        copyGrid.dataset.dividerPositions = getDividerPositions().join(',')
        const head = copy.querySelector('head')
        const inlineStyles = document.createElement('style')
        inlineStyles.textContent = getStyles()
        head.querySelectorAll('link[rel="stylesheet"]').forEach((link) => link.remove())
        head.append(inlineStyles)
        copy.querySelectorAll('.cell-content').forEach((cell) => {
            cell.contentEditable = 'false'
        })
        copy.querySelector('.save-button').disabled = true
        copy.querySelectorAll('script').forEach((script) => script.remove())

        const savedCopyScript = document.createElement('script')
        savedCopyScript.textContent = `(${initializeSavedCopy.toString()})();`
        copy.querySelector('body').append(savedCopyScript)

        const blob = new Blob([`<!doctype html>\n${copy.outerHTML}`], { type: 'text/html;charset=utf-8' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        const focusCell = Array.from(document.querySelectorAll('.cell')).find((cell) => {
            return cell.querySelector('.cell-header').textContent === 'FOCUS'
        })
        const focusContent = focusCell.querySelector('.cell-content').textContent
        link.download = `Sequine: ${focusContent} ${new Date().toISOString()}.html`
        link.click()
        setTimeout(() => URL.revokeObjectURL(url), 1000)
        initialContent = cells.map((cell) => cell.innerHTML)
        initialDividerPositions = getDividerPositions()
        updateSaveButton()
    }

    cells.forEach((cell) => {
        cell.addEventListener('dblclick', () => {
            cell.contentEditable = 'true'
            cell.focus()
        })
        cell.addEventListener('blur', () => {
            cell.contentEditable = 'false'
        })
        cell.addEventListener('input', updateSaveButton)
    })

    saveButton.disabled = true
    saveButton.addEventListener('click', downloadPage)
    window.addEventListener('resize', resizeGrid)
    dividerPositions = getDividerPositions()
    resizeGrid()

    function enableGutterDrag(gutter, direction) {
        const track = Number(gutter.dataset.track)
        const property = direction === 'column' ? 'gridTemplateColumns' : 'gridTemplateRows'
        const coordinate = direction === 'column' ? 'clientX' : 'clientY'

        gutter.addEventListener('pointerdown', (event) => {
            if (event.button !== 0) return

            const sizes = getComputedStyle(grid)[property].split(/\s+/).map(parseFloat)
            const before = track - 1
            const after = track + 1
            const start = event[coordinate]
            const beforeSize = sizes[before]
            const afterSize = sizes[after]

            gutter.setPointerCapture(event.pointerId)

            gutter.onpointermove = (moveEvent) => {
                const delta = Math.max(-beforeSize, Math.min(afterSize, moveEvent[coordinate] - start))
                sizes[before] = `${beforeSize + delta}px`
                sizes[after] = `${afterSize - delta}px`
                grid.style[property] = sizes.map((size) => typeof size === 'number' ? `${size}px` : size).join(' ')
                dividerPositions = getDividerPositions()
                updateSaveButton()
            }
            gutter.onpointerup = () => {
                gutter.onpointermove = null
                gutter.onpointerup = null
            }
        })
    }

    document.querySelectorAll('.gutter-col').forEach((gutter) => enableGutterDrag(gutter, 'column'))
    document.querySelectorAll('.gutter-row').forEach((gutter) => enableGutterDrag(gutter, 'row'))
}

initializeSavedCopy()
