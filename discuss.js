/// Data classes

const actors = new Map();
let actorCount = 0;
function generateId (actor) {
const id = `actor${actorCount}`;
actorCount += 1;
actors.set(id, actor);
return id;
} // generateId

function getActor (id) {
return actors.get(id);
} // getActor

class Discussion {
#id = "";
get id () {return this.#id;}
#students = [];
get students () {return this.#students;}

constructor () {
this.#id = generateId(this);
} // constructor

addStudent (s) {this.#students.push(s);}

toString () {
return `<div class="discussion actor" id="${this.#id}">
<h1 class="info">Discussion</h1>

<div class="actions">
<label>Add container labels <input type="checkbox" class="action immediate" data-action="addContainerLabels"></label>
<button class="action" data-action="addStudent">add student</button>
</div><!-- .actions -->

<div class="students">
${this.#students.length > 0? toList(this.#students) : ""}
</div><!-- .students -->
</div><!-- .discussion -->
`; // return
}; // toString
}; // class Discussion

class Student {
#id = "";
get id () {return this.#id;}
#name = "";
#votes = 0;
#documents = [];
get name () {return this.#name;}
get documents () {return this.#documents;}

constructor (name) {
this.#id = generateId(this);
this.#name = name;
} // constructor

addDocument (d) {this.#documents.push(d);}

toString () {
return `<div class="student actor" id="${this.#id}">
<h2 class="info">${this.#name}: ${this.#documents.length} documents</h2>

<div class="actions">
<button class="action" data-action="addDocument">add document</button>
</div><!-- .actions -->


<div class="documents">
${this.#documents.length === 0? "no documents to discuss" : toList(this.#documents)}
</div><!-- .documents -->
</div><!-- .student -->
`; // return
} // toString
}; // class Student

class Document {
#id = "";
get id () {return this.#id;}
#title = "";
#url = "";
#votes = 0;
#comments = [];
get comments () {return this.#comments;}

constructor (title, url) {
this.#id = generateId(this);
this.#title = title;
this.#url = url;
}

upVote () {this.#votes += 1;}
downVote () {if (this.#votes > 0) this.#votes -= 1;}
addComment (c) {this.#comments.push(c);}

toString () {
return `<div class="document actor" id="${this.#id}">
<h3 class="info">
<a href="$this.#url}">${this.#title}</a>
<br>(${this.#votes} votes)
</h3>

<div class="actions">
<button class="action immediate" data-action="upVote">up vote</button>
<button class="action immediate" data-action="downVote">down vote</button>
<button class="action" data-action="addComment">add comment</button>
</div><!-- .actions -->

<div class="comments">
${this.#comments.length === 0? "no comments" : toList(this.#comments, "ol")}
</div><!-- .comments -->
</div><!-- .document -->
`; // return
} // toString
}; // class Document

class Comment {
#id = "";
get id () {return this.#id;}
#author = null;
#text = "";
#votes = 0;
#replies = [];
get replies () {return this.#replies;}


constructor (author, text) {
this.#id = generateId(this);
this.#author = author;
this.#text = text;
} // constructor

upVote () {this.#votes += 1;}
downVote () {if (this.#votes > 0) this.#votes -= 1;}
addComment (c) {this.#replies.push(c);}

toString () {
return `<div class="comment actor" id="${this.#id}">
<div class="info">From ${this.#author.name} (${this.#votes} votes):
<br>${this.#text}
</div>

<div class="actions">
<button class="action immediate" data-action="upVote">up vote</button>
<button class="action immediate" data-action="downVote">down vote</button>
<button class="action" data-action="addComment">add reply</button>
</div><!-- .actions -->

<div class="replies">
${this.#replies.length === 0? "" : toList(this.#replies, "ol")}
</div><!-- .replies -->
</div><!-- .comment -->
`; // return
} // toString
}; // class Comment


/// operators

function toList (l, type = "ul") {
return `<${type}><li>
${l.join("\n</li><li>\n")}
</li></${type}>
`;
} // toList

function addContainerLabels () {
document.querySelectorAll(".students,.documents,.comments").forEach(container => {
container.setAttribute("role", "region");
container.setAttribute("aria-label", container.className);
});
} // addContainerLabels

function actionHandler (e) {
const action = e.target.dataset.action;
const actor = getActor(e.target.closest(".actor").id);
const immediate = e.target.classList.contains("immediate");
performAction(action, actor, immediate);
} // actionHandler

function performAction (action, actor, immediate) {
console.log("performAction: ", action, actor, immediate);
if (immediate) {
actor[action]();

} else {
// display form
// get result and perform action
} // if

rerender(actor);
} // performAction

function rerender (actor) {
const element = document.querySelector(`#${actor.id}`);
console.log("rerendering ", actor, element);
element.insertAdjacentHTML("beforeBegin", actor.toString());
element.remove();
} // rerender

/// start

const discussion = new Discussion();
function discuss (element = document.body) {
element.insertAdjacentHTML("afterBegin", 
`<dialog id="get-info" hidden>
<form>
<div class="field" hidden><label>Name: <input name="name"></label></div>
<div class="field" hidden><label>Title: <input name="title"></label></div>
<div class="field" hidden><label>URL: <input name="url"></label></div>
<div class="field" hidden><label>Student: <select name="student"></select></label></div>
<div class="field" hidden><label>Comment: <input name="comment"></label></div>
<div class="field" hidden><button type="submit">Add</button></div>
</form>
</dialog>

${discussion}
`); // insertAdjacentHTML
element.addEventListener("click", actionHandler);
} // discuss

$discussion = discuss(); // $discussion is the dom root


/// test data

const Rich = new Student("Rich")
const Mary = new Student ("Mary")

discussion.addStudent(Rich);
discussion.addStudent(Mary);


Rich.addDocument(new Document("Numbering nested lists via CSS", "https://example.com/nested.html"));
Rich.addDocument(new Document("Navigation of deeply nested structures using HTML trees", "https://example.com/trees.html"));

Rich.documents[1].addComment(new Comment(Mary, "HTML trees are cool, but a pain to construct."));
Rich.documents[1].comments[0].addComment(new Comment(Rich, "but in the right circumstance they can afford better UX for screen reader users"));

