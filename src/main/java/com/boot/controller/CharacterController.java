package com.boot.controller;

import java.util.List;

import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;

import com.boot.model.Character;
import com.boot.repository.CharacterRepository;

@RestController
@RequestMapping("api/v1/")
public class CharacterController {
    
    @Autowired
    private CharacterRepository characterRepository;

    @RequestMapping(value = "Characters", method = RequestMethod.GET)
    public List<Character> list() {
        return characterRepository.findAll();
    }

    @RequestMapping(value = "Characters", method = RequestMethod.POST)
    public Character create(@RequestBody Character character) {
        return characterRepository.saveAndFlush(character);
    }

    @RequestMapping(value = "Characters/{id}", method = RequestMethod.GET)
    public Character get(@PathVariable Long id) {
        return characterRepository.findOne(id);
    }

    @RequestMapping(value = "Characters/{id}", method = RequestMethod.PUT)
    public Character update(@PathVariable Long id, @RequestBody Character character) {
        Character existingCharacter = characterRepository.findOne(id);
        BeanUtils.copyProperties(character, existingCharacter);
        
        return characterRepository.saveAndFlush(existingCharacter);
    }

    @RequestMapping(value = "Characters/{id}", method = RequestMethod.DELETE)
    public Character delete(@PathVariable Long id) {
        Character existingCharacter = characterRepository.findOne(id);
        characterRepository.delete(existingCharacter);
        return existingCharacter;
    }
}
