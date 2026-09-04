CREATE TABLE pokemon (
    id BIGSERIAL PRIMARY KEY,
    pokeapi_id INTEGER NOT NULL UNIQUE,
    national_dex_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL UNIQUE,
    height_decimeters INTEGER NOT NULL,
    weight_hectograms INTEGER NOT NULL,
    base_experience INTEGER,
    generation VARCHAR(50),
    is_default_variant BOOLEAN NOT NULL,
    variant_of_national_dex_id INTEGER,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_pokemon_national_dex_id ON pokemon (national_dex_id);
CREATE INDEX idx_pokemon_variant_of_national_dex_id ON pokemon (variant_of_national_dex_id);

CREATE TABLE pokemon_types (
    pokemon_id BIGINT NOT NULL REFERENCES pokemon (id) ON DELETE CASCADE,
    slot INTEGER NOT NULL,
    type_name VARCHAR(50) NOT NULL,
    PRIMARY KEY (pokemon_id, slot)
);

CREATE TABLE pokemon_abilities (
    pokemon_id BIGINT NOT NULL REFERENCES pokemon (id) ON DELETE CASCADE,
    slot INTEGER NOT NULL,
    ability_name VARCHAR(100) NOT NULL,
    is_hidden BOOLEAN NOT NULL,
    PRIMARY KEY (pokemon_id, slot)
);

CREATE TABLE pokemon_stats (
    pokemon_id BIGINT NOT NULL REFERENCES pokemon (id) ON DELETE CASCADE,
    stat_name VARCHAR(50) NOT NULL,
    base_value INTEGER NOT NULL,
    PRIMARY KEY (pokemon_id, stat_name)
);

CREATE TABLE pokemon_sprites (
    pokemon_id BIGINT NOT NULL REFERENCES pokemon (id) ON DELETE CASCADE,
    sprite_name VARCHAR(100) NOT NULL,
    sprite_url TEXT NOT NULL,
    PRIMARY KEY (pokemon_id, sprite_name)
);
