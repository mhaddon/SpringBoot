/**
 * This class is responsible for controlling the pages "Scene", the scene is the
 * design of the page, and just the code that modifies the DOM.
 * 
 * The goal is to seperate the code that modifies the DOM from the code that
 * works behind the scenes.
 * 
 * @returns {SceneController.SceneAnonym$0}
 */
var SceneController = function () {
    /**
     * This object caches all of the pages elements, and also stores any
     * variables that are revelent to the pages design.
     */
    this.Data = {
        Elements: {
            Overlay: {
                loading: null,
                parent: null
            },
            Form: {
                characterCreation: null,
                characterCreationTitle: null
            },
            Buttons: {
                createNewCharacter: null,
                cancelCharacterCreation: null
            },
            List: {
                characterHistory: null
            }
        }
    }

    /**
     * This return function allows us to be able to see the functions and variables
     * that we define with this.
     * See the return value in Socket.js for more information.
     */
    return {
        Data: this.Data,
        loadElementCache: this.loadElementCache,
        attachListeners: this.attachListeners,
        onCharacterSubmit: this.onCharacterSubmit,
        loadCharacters: this.loadCharacters,
        showCharacterForm: this.showCharacterForm,
        showCharacterTitleForm: this.showCharacterTitleForm
    }
}

/**
 * This method scans the page and updates the cache of elements we have.
 * 
 * The benefit of caching the elements on the DOM is it increases the performace
 * greatly. (Especially for elements that are not found via an ID)
 * 
 * @returns {undefined}
 */
SceneController.prototype.loadElementCache = function () {
    /**
     * Elements that are part of the overlay
     */
    this.Data.Elements.Overlay.parent = document.getElementById('overlayDiv');
    this.Data.Elements.Overlay.loading = document.getElementById('loadingOverlay');

    /**
     * Elements that are HTML forms
     */
    this.Data.Elements.Form.characterCreation = document.getElementById('CharacterCreationForm');
    this.Data.Elements.Form.characterCreationTitle = document.getElementById('CharacterCreationTitle');


    /**
     * 
     */
    this.Data.Elements.Buttons.createNewCharacter = document.getElementById('CreateNewCharacter');
    this.Data.Elements.Buttons.cancelCharacterCreation = document.getElementById('CancelCharacterCreation');

    /**
     * Elements that are Lists
     * ie: 
     * Message history, currently connected users, active channels
     */
    this.Data.Elements.List.characterHistory = document.getElementById('CharacterHistoryList');
    this.Data.Elements.List.characterHistoryUL = document.querySelector('#CharacterHistoryList .characterlist');
}

/**
 * Attaches listeners that are required for the page to run.
 * Mostly just detecting if a form has been submitted.
 * 
 * @returns {undefined}
 */
SceneController.prototype.attachListeners = function () {
    this.Data.Elements.Form.characterCreation.onsubmit = this.onCharacterSubmit.bind(this);

    this.Data.Elements.Buttons.cancelCharacterCreation.onclick = this.showCharacterTitleForm.bind(this);
    this.Data.Elements.Buttons.createNewCharacter.onclick = this.showCharacterForm.bind(this);
}

SceneController.prototype.showCharacterForm = function (e) {
    this.Data.Elements.Form.characterCreationTitle.style.display = 'none';
    this.Data.Elements.Form.characterCreation.style.display = 'block';

    document.querySelector("#CharacterCreationForm [name='name']").value = "";
    document.querySelector("#CharacterCreationForm [name='backstory']").value = "";
    document.querySelector("#CharacterCreationForm [name='imageURL']").value = "";
    document.querySelector("#CharacterCreationForm [name='id']").value = "";
    document.querySelector("#CharacterCreationForm [name='fulfilledLifePurpose']").checked = false;
}

SceneController.prototype.showCharacterTitleForm = function (e) {
    e.preventDefault();
    this.Data.Elements.Form.characterCreation.style.display = 'none';
    this.Data.Elements.Form.characterCreationTitle.style.display = 'block';
}

/**
 * This method is a callback, which is ran when the user submits a character to
 * be saved
 * 
 * @param {Object} e - Event information
 * @returns {undefined}
 */
SceneController.prototype.onCharacterSubmit = function (e) {
    e.preventDefault();

    var Elements = {};

    /**
     * Convert NodeList to Array then foreach it
     */
    ([].slice.call(document.querySelectorAll('#CharacterCreationForm [name]'))).forEach(function (e) {
        if (e.getAttribute('type') === 'checkbox') {
            Elements[e.getAttribute('name').trim()] = e.checked;
        } else {
            Elements[e.getAttribute('name').trim()] = e.value.trim();
        }
    }.bind(this));

    if (Elements['id'].length === 0) {
        loadJSON('/api/v1/Characters', 'POST', Elements, function (obj) {
            ViewModel.addCharacter(obj);
        }.bind(this));
    } else {
        loadJSON('/api/v1/Characters/' + Elements['id'], 'PUT', Elements, function (obj) {
            ViewModel.addCharacter(obj);
        }.bind(this));
    }
}

SceneController.prototype.loadCharacters = function () {
    loadJSON('/api/v1/Characters', 'GET', null, function (obj) {
        obj.forEach(function (e) {
            ViewModel.Characters.push(e);
        }.bind(this));
        this.Data.Elements.Overlay.parent.style.display = 'none';

    }.bind(this));
}

/**
 * Because of how I created this function/object prototype, we need to 
 * instantiate it. 
 * So it is instantiated as Scene.
 * @type SceneController
 */
var Scene = new SceneController;