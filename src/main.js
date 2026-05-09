import './style.css'
import Split from 'split-grid'

document.querySelector('#app').innerHTML = `
<div class="grid">
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="cell" contenteditable="true"></div>
    <div class="gutter-col gutter-col-1"></div>
    <div class="gutter-col gutter-col-3"></div>
    <div class="gutter-row gutter-row-1"></div>
    <div class="gutter-row gutter-row-3"></div>
</div>
`

Split({
    columnGutters: [{
        track: 1,
        element: document.querySelector('.gutter-col-1'),
    }, {
        track: 3,
        element: document.querySelector('.gutter-col-3'),
    }],
    rowGutters: [{
        track: 1,
        element: document.querySelector('.gutter-row-1'),
    }, {
        track: 3,
        element: document.querySelector('.gutter-row-3'),
    }],
    onDragEnd: (d, t) => { console.log(d); console.log(t) }
})
