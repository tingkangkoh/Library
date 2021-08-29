
class Book{
    constructor(title,author,pages,read){
        this.title=title;
        this.author=author;
        this.pages=pages;
        this.read=read;
       
    }
    toggle(){
        if(this.read==true){
            this.read=false;
        }
        else if(this.read==false){
            this.read=true;
        }
    }
}

var Storage={
    saveLocal:function(){
        localStorage.setItem('library', JSON.stringify(Library.getLibrary()));
    },
    JSONToBook:function(book){
        return new Book(book.title, book.author, book.pages, book.read);
    },
    restoreLocal:function(){
        const books = JSON.parse(localStorage.getItem('library'))
        if (books) {
            Library.setLibrary(books.map((book) => this.JSONToBook(book)));
        } else {
          Library.empty();
        }
    }
}
var Library={
    myLibrary:[],
    getLibrary:function(){
        return this.myLibrary;
    },
    getAtIndex:function(index){
        return this.myLibrary[index];
    },
    removeAtIndex:function(index){
        this.myLibrary.splice(index,1);
    },
    setLibrary:function(obj){
        console.log(this.myLibrary);
        console.log(obj);
        this.myLibrary=obj;
        console.log(this.myLibrary);
    },
    getLibraryLength:function(){
        return this.myLibrary.length;
    },
    empty:function(){
        this.myLibrary=[];
    },
    add:function(Book){
        this.myLibrary.push(Book);
        Storage.saveLocal();
    }
    
}

// restoreLocal();
// updateContainer();

var DisplayController={
    init:function(){
    
        let form=document.querySelector("#bookForm");

        var modal = document.getElementById("myModal");

        var btn = document.getElementById("addBook");

        btn.onclick = function() {
            modal.style.display = "block";
        }

        var span = document.getElementsByClassName("close")[0];

        span.onclick = function() {
            modal.style.display = "none";
        }
        //form.onsubmit=addBook;

        form.addEventListener("submit", event=>{
            event.preventDefault();
            this.addBook();
            
        })

        // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
            if (event.target == modal) {
                modal.style.display = "none";
            }
        }
        //var Library=new Library();
        //updateContainer();
    },

    addBook:function(){

        let form=document.querySelector("#bookForm");
        var modal = document.getElementById("myModal");

        modal.style.display = "none";
        var title=document.getElementById("title").value;
        var author=document.getElementById("author").value;
        var pages=document.getElementById("pages").value;
        var read=document.getElementById("read").checked;
        var book= new Book(title,author,pages,read);
        Library.add(book);
        this.updateContainer();
        form.reset();
    },
  



    updateContainer:function(){
        var container=document.querySelector(".container");
        container.innerHTML="";
        for(let i=0;i<Library.getLibraryLength();i++){
            let card=document.createElement("div");
            card.setAttribute("data",i);
            card.classList.add("card");
            var title=document.createElement("p");
            var author=document.createElement("p");
            var pages=document.createElement("p");
            title.textContent=Library.getAtIndex(i).title;
            author.textContent="by "+Library.getAtIndex(i).author;
            pages.textContent=Library.getAtIndex(i).pages+" pages";
            card.appendChild(title);
            card.appendChild(author);
            card.appendChild(pages);

            var ReadButton=document.createElement("button");
            ReadButton.classList.add("readButton");
            ReadButton.id="readButton"+(i+1);

            ReadButton.addEventListener("click",function(){
                Library.getAtIndex(i).toggle();
                Storage.saveLocal();
                DisplayController.updateContainer();
            })

            if(Library.getAtIndex(i).read==true){
                ReadButton.textContent="Read";
                ReadButton.classList.add("button-green");
                card.classList.add("card-green");
            }else{
                ReadButton.textContent="Not Read";
                ReadButton.classList.add("button-red");
                card.classList.add("card-red");
            }
            var removeButton=document.createElement("button");
            removeButton.classList.add("removeButton");
            removeButton.setAttribute("data",i);
            removeButton.innerHTML="<i class='fas fa-times-circle fa-3x'></i>";

            removeButton.addEventListener("click",function(e){
                let index=this.getAttribute("data");
                Library.removeAtIndex(index);
                Storage.saveLocal();
                DisplayController.updateContainer();
            })
            
            var br=document.createElement("br");

            card.appendChild(ReadButton);
            card.appendChild(br);
            card.appendChild(removeButton);

            container.appendChild(card);

            

        }
    }
    

}

DisplayController.init();
Storage.restoreLocal();
DisplayController.updateContainer();

