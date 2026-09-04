package com.pokedex.backend.pokemon;

import java.time.Instant;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import jakarta.persistence.CollectionTable;
import jakarta.persistence.Column;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.MapKeyColumn;
import jakarta.persistence.OrderColumn;
import jakarta.persistence.Table;

@Entity
@Table(name = "pokemon")
public class Pokemon {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(name = "pokeapi_id", nullable = false, unique = true)
	private int pokeapiId;

	@Column(name = "national_dex_id", nullable = false)
	private int nationalDexId;

	@Column(nullable = false, unique = true)
	private String name;

	@Column(name = "height_decimeters", nullable = false)
	private int heightDecimeters;

	@Column(name = "weight_hectograms", nullable = false)
	private int weightHectograms;

	@Column(name = "base_experience")
	private Integer baseExperience;

	private String generation;

	@Column(name = "is_default_variant", nullable = false)
	private boolean defaultVariant;

	@Column(name = "variant_of_national_dex_id")
	private Integer variantOfNationalDexId;

	@ElementCollection
	@CollectionTable(name = "pokemon_types", joinColumns = @JoinColumn(name = "pokemon_id"))
	@OrderColumn(name = "slot")
	@Column(name = "type_name", nullable = false)
	private List<String> types = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "pokemon_abilities", joinColumns = @JoinColumn(name = "pokemon_id"))
	@OrderColumn(name = "slot")
	private List<PokemonAbility> abilities = new ArrayList<>();

	@ElementCollection
	@CollectionTable(name = "pokemon_stats", joinColumns = @JoinColumn(name = "pokemon_id"))
	@MapKeyColumn(name = "stat_name")
	@Column(name = "base_value", nullable = false)
	private Map<String, Integer> stats = new LinkedHashMap<>();

	@ElementCollection
	@CollectionTable(name = "pokemon_sprites", joinColumns = @JoinColumn(name = "pokemon_id"))
	@MapKeyColumn(name = "sprite_name")
	@Column(name = "sprite_url", nullable = false)
	private Map<String, String> sprites = new LinkedHashMap<>();

	@CreationTimestamp
	@Column(name = "created_at", nullable = false, updatable = false)
	private Instant createdAt;

	@UpdateTimestamp
	@Column(name = "updated_at", nullable = false)
	private Instant updatedAt;

	protected Pokemon() {
	}

	public Long getId() {
		return id;
	}

	public int getPokeapiId() {
		return pokeapiId;
	}

	public void setPokeapiId(int pokeapiId) {
		this.pokeapiId = pokeapiId;
	}

	public int getNationalDexId() {
		return nationalDexId;
	}

	public void setNationalDexId(int nationalDexId) {
		this.nationalDexId = nationalDexId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public int getHeightDecimeters() {
		return heightDecimeters;
	}

	public void setHeightDecimeters(int heightDecimeters) {
		this.heightDecimeters = heightDecimeters;
	}

	public int getWeightHectograms() {
		return weightHectograms;
	}

	public void setWeightHectograms(int weightHectograms) {
		this.weightHectograms = weightHectograms;
	}

	public Integer getBaseExperience() {
		return baseExperience;
	}

	public void setBaseExperience(Integer baseExperience) {
		this.baseExperience = baseExperience;
	}

	public String getGeneration() {
		return generation;
	}

	public void setGeneration(String generation) {
		this.generation = generation;
	}

	public boolean isDefaultVariant() {
		return defaultVariant;
	}

	public void setDefaultVariant(boolean defaultVariant) {
		this.defaultVariant = defaultVariant;
	}

	public Integer getVariantOfNationalDexId() {
		return variantOfNationalDexId;
	}

	public void setVariantOfNationalDexId(Integer variantOfNationalDexId) {
		this.variantOfNationalDexId = variantOfNationalDexId;
	}

	public List<String> getTypes() {
		return types;
	}

	public void setTypes(List<String> types) {
		this.types = new ArrayList<>(types);
	}

	public List<PokemonAbility> getAbilities() {
		return abilities;
	}

	public void setAbilities(List<PokemonAbility> abilities) {
		this.abilities = new ArrayList<>(abilities);
	}

	public Map<String, Integer> getStats() {
		return stats;
	}

	public void setStats(Map<String, Integer> stats) {
		this.stats = new LinkedHashMap<>(stats);
	}

	public Map<String, String> getSprites() {
		return sprites;
	}

	public void setSprites(Map<String, String> sprites) {
		this.sprites = new LinkedHashMap<>(sprites);
	}

	public Instant getCreatedAt() {
		return createdAt;
	}

	public Instant getUpdatedAt() {
		return updatedAt;
	}
}
