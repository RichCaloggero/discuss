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
#parent = null;
get parent () {return this.#parent;}

constructor () {
this.#id = generateId(this);
} // constructor

addStudent (s) {this.#students.push(s);}
add (obj) {
return this.addStudent(new Student(obj.name, this));
} // add

toString () {
return `<div class="discussion actor" id="${this.#id}">
<h1 class="info">Discussion</h1>

<div class="actions">
<!--<label>Add container labels <input type="checkbox" class="action immediate" data-action="addContainerLabels"></label>-->
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
get name () {return this.#name;}
#votes = 0;
#documents = [];
get documents () {return this.#documents;}
#fields = ["name"];
get fields () {return this.#fields;}
#parent = null;
get parent () {return this.#parent;}

constructor (name, parent) {
this.#id = generateId(this);
this.#name = name;
this.#parent = parent;
} // constructor

addDocument (d) {this.#documents.push(d);}
add (obj) {
return this.addDocument(new Document(obj.title, obj.url, this));
} // add

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
#fields = ["title", "url"];
get fields () {return this.#fields;}
#parent = null;
get parent () {return this.#parent;}

constructor (title, url, parent) {
this.#id = generateId(this);
this.#title = title;
this.#url = url;
this.#parent = parent;
}

upVote () {this.#votes += 1;}
downVote () {if (this.#votes > 0) this.#votes -= 1;}
addComment (c) {this.#comments.push(c);}
add (obj) {
return this.addComment(new Comment(obj.author, obj.text, this));
} // add

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
#author = "";
#text = "";
#votes = 0;
#replies = [];
get replies () {return this.#replies;}
#fields = ["student", "text"];
get fields () {return this.#fields;}
#parent = null;
get parent () {return this.#parent;}


constructor (author, text, parent) {
this.#id = generateId(this);
this.#author = author;
this.#text = text;
this.#parent = parent;
} // constructor

upVote () {this.#votes += 1;}
downVote () {if (this.#votes > 0) this.#votes -= 1;}
addComment (c) {this.#replies.push(c);}
add (obj) {
return this.addComment(new Comment(obj.author, obj.text, this));
} // add

toString () {
return `<div class="comment actor" id="${this.#id}">
<div class="info">From ${this.#author || "anonymous"} (${this.#votes} votes):
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




function not(x) {return !x;}

function zip (names, values) {
if (names.length !== values.length) throw new Error("zip: names and values must be same length");
return Object.fromEntries(
names.map((name, i) => [name, values[i]])
); // fromEntries
} // zip

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
if (not(e.target.classList.contains("action"))) return;
const action = e.target.dataset.action;
if (not(action)) return;
const actor = getActor(e.target.closest(".actor").id);
const immediate = e.target.classList.contains("immediate");
performAction(action, actor, immediate, e.target);
} // actionHandler

function performAction (action, actor, immediate, target) {
console.log("performAction: ", action, actor, immediate);
if (immediate) {
actor[action]();
rerender(actor);

} else {
// display form
displayForm(actor, action, target);
} // if

} // performAction

function displayForm (actor, action, target) {
const dialog = document.querySelector("#get-info");
const form = dialog.querySelector("form");
form.reset();

const fieldNames = action === "addStudent" ? ["name"]
: action === "addDocument"? ["title", "url"]
: action === "addComment"? ["author", "text"]
: null;
console.log("fieldNames: ", fieldNames);

const fields = [...form.querySelectorAll(".field")]
.filter(x => {
return not(x.hidden = not(fieldNames.includes(x.querySelector("[name]").name)))
}); // filter
console.log("fields: ", fields);

populateAuthorField(form.querySelector("[name='author']"), discussion.students.map(x => x.name));

dialog.hidden = false;
dialog.showModal();
fields[0].focus();

form.addEventListener("submit", e => {
const values = fields.map(x => x.querySelector("[name]").value);
actor.add(zip(fieldNames, values));

fields.forEach(x => x.hidden = true);

dialog.close();
rerender(actor).querySelector(".action").focus();
},
{once: true}); // submit

function populateAuthorField (select, names) {
names.forEach(x => {
const option = document.createElement("option");
option.textContent = option.value = x;
select.add(option);
});
} // populateAuthorField
} // displayForm


function rerender (actor) {
const element = document.querySelector(`#${actor.id}`);
console.log("rerendering ", actor, element);
debugger;
element.insertAdjacentHTML("beforeBegin", actor.toString());
const result = element.previousElementSibling;
element.remove();
return result;
} // rerender

/// start

let discussion = new Discussion();
function discuss (element = document.body) {
element.insertAdjacentHTML("afterBegin", 
`<dialog id="get-info" hidden>
<form method="dialog">
<div class="field" hidden><label>Name: <input name="name"></label></div>
<div class="field" hidden><label>Title: <input name="title"></label></div>
<div class="field" hidden><label>URL: <input name="url"></label></div>
<div class="field" hidden><label>Author: <select name="author"></select></label></div>
<div class="field" hidden><label>Comment: <br><textarea rows="10" cols="80" name="text"></textarea></label></div>
<div class="submit"><button type="submit">Add</button></div>
</form>
</dialog>

${discussion}
`); // insertAdjacentHTML

element.addEventListener("click", actionHandler);
return element;
} // discuss



/// test data

const Rich = new Student("Rich")
const Mary = new Student ("Mary")

discussion.addStudent(Rich);
discussion.addStudent(Mary);


Rich.addDocument(new Document("Numbering nested lists via CSS", "https://example.com/nested.html"));
Rich.addDocument(new Document("Navigation of deeply nested structures using HTML trees", "https://example.com/trees.html"));

Rich.documents[1].addComment(new Comment(Mary.name, "HTML trees are cool, but a pain to construct."));
Rich.documents[1].comments[0].addComment(new Comment(Rich.name, "but in the right circumstance they can afford better UX for screen reader users"));

