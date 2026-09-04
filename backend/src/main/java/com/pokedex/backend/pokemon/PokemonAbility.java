package com.pokedex.backend.pokemon;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;

@Embeddable
public class PokemonAbility {

	@Column(name = "ability_name", nullable = false)
	private String name;

	@Column(name = "is_hidden", nullable = false)
	private boolean hidden;

	protected PokemonAbility() {
	}

	public PokemonAbility(String name, boolean hidden) {
		this.name = name;
		this.hidden = hidden;
	}

	public String getName() {
		return name;
	}

	public boolean isHidden() {
		return hidden;
	}
}
