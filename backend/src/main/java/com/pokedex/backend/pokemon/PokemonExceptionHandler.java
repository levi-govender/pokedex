package com.pokedex.backend.pokemon;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class PokemonExceptionHandler {

	@ExceptionHandler(PokemonNotFoundException.class)
	public ProblemDetail handlePokemonNotFound(PokemonNotFoundException exception) {
		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		problemDetail.setTitle("Pokemon not found");
		problemDetail.setDetail(exception.getMessage());
		return problemDetail;
	}
}
