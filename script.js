document.addEventListener('DOMContentLoaded', function() {
    const moodboard = document.getElementById('moodboard');
    const imageInput = document.getElementById('imageInput');
    const squareBtn = document.getElementById('squareFormat');
    const phoneBtn = document.getElementById('phoneFormat');
    const landscapeBtn = document.getElementById('landscapeFormat');
    const saveBtn = document.getElementById('saveBoard');

    // Format buttons
    squareBtn.addEventListener('click', () => {
        moodboard.style.width = '600px';
        moodboard.style.height = '600px';
    });

    phoneBtn.addEventListener('click', () => {
        moodboard.style.width = '400px';
        moodboard.style.height = '700px';
    });

    landscapeBtn.addEventListener('click', () => {
        moodboard.style.width = '800px';
        moodboard.style.height = '500px';
    });

    // Save functionality
    saveBtn.addEventListener('click', () => {
        html2canvas(moodboard).then(canvas => {
            const link = document.createElement('a');
            link.download = 'moodboard.png';
            link.href = canvas.toDataURL();
            link.click();
        });
    });

    // Image upload and drag functionality
    imageInput.addEventListener('change', function(e) {
        const files = e.target.files;
        for (let file of files) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const img = document.createElement('img');
                img.src = e.target.result;
                img.className = 'moodboard-image';
                
                // Random position within moodboard
                const x = Math.random() * (moodboard.offsetWidth - 200);
                const y = Math.random() * (moodboard.offsetHeight - 200);
                img.style.left = x + 'px';
                img.style.top = y + 'px';
                
                moodboard.appendChild(img);
                makeImageDraggable(img);
            };
            reader.readAsDataURL(file);
        }
    });
});

function makeImageDraggable(element) {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    element.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e.preventDefault();
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e.preventDefault();
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
}

<rewritten_block>
<script src="https://html2canvas.hertzen.com/dist/html2canvas.min.js"></script>
</rewritten_block>