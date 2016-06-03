/**
 * When adapting Vue it seems that you dont really need to be able to reference
 * the components in javascript after you have created the vue object.
 *
 * So instead of having loads of random components accessable globally, i have
 * contained them all in one function/class.
 *
 * I could have nestled these components into the parent, but i think that
 * would have made the code unreadable.
 *
 * This class returns the vue model controller.
 *
 * @returns {Vue}
 */
var ViewModel = new (function () {
    /**
     * Create the component that controlls the list of characters.
     */
    var characterListComponent = Vue.extend({
        /**
         * The components design template, see the "text/x-template" tags in
         * index.html
         */
        template: '#characterList-template',
        /**
         * The components variables that it inherits from its parent
         */
        props: ['Characters'],
        /**
         * Every component requires a data feild, but i do not need it as
         * i inherit all the relevent data. So it is filled with nonsense.
         */
        data: function () {
            return {
                a: 1
            }
        },
        methods: {
            editCharacter: function(Character) {
                Scene.showCharacterForm();
                
                document.querySelector("#CharacterCreationForm [name='name']").value = Character.name;
                document.querySelector("#CharacterCreationForm [name='backstory']").value = Character.backstory;
                document.querySelector("#CharacterCreationForm [name='imageURL']").value = Character.imageURL;
                document.querySelector("#CharacterCreationForm [name='id']").value = Character.id;
                document.querySelector("#CharacterCreationForm [name='fulfilledLifePurpose']").checked = Character.fulfilledLifePurpose;
            }
        }
    });

    /**
     * Create the parent vue controller which incorporates all of the above
     * components.
     * This class is what the ViewModel class returns.
     */
    var pageViewmodel = new Vue({
        el: '#vueApp',
        data: {
            /**
             * All of the recorded characters
             * See characterListComponent to see its use.
             */
            Characters: []
        },
        /**
         * All the components that this vue class uses.
         * Vue component names have a - requirement, for some reason
         */
        components: {
            "characterlist-component": characterListComponent
        },
        /**
         * The various methods we can call to modify the displays information.
         * All these methods can be accessed and called from outside of this class
         * by doing:
         * ViewModel.UserListIndex(), or whatever.
         */
        methods: {
            /**
             * Finds the index of a specific session id in the characterlist.
             * @param {String} ID
             * @returns {Number|Boolean}
             */
            CharacterListIndex: function (ID) {
                for (var i = 0; i < this.Characters.length; i++) {
                    var e = this.Characters[i];
                    if (e.id === ID) {
                        return i;
                    }
                }
                return false;
            },
            /**
             * Adds a new user to the characterlist.
             * @param {Object} data
             * @returns {undefined}
             */
            addCharacter: function (data) {
                var CharacterIndex = this.CharacterListIndex(data.id);
                if (CharacterIndex !== false) {
                    this.Characters.$remove(this.Characters[CharacterIndex]);
                }
                this.Characters.push(data);
            }
        }
    });

    return pageViewmodel;
});