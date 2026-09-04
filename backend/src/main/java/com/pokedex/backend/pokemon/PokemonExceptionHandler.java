package com.pokedex.backend.pokemon;

import jakarta.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ProblemDetail;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;

@RestControllerAdvice
public class PokemonExceptionHandler {

	@ExceptionHandler(PokemonNotFoundException.class)
	public ProblemDetail handlePokemonNotFound(PokemonNotFoundException exception) {
		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.NOT_FOUND);
		problemDetail.setTitle("Pokemon not found");
		problemDetail.setDetail(exception.getMessage());
		return problemDetail;
	}

	@ExceptionHandler(ConstraintViolationException.class)
	public ProblemDetail handleConstraintViolation(ConstraintViolationException exception) {
		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		problemDetail.setTitle("Invalid request parameters");
		problemDetail.setDetail(exception.getMessage());
		return problemDetail;
	}

	@ExceptionHandler(MethodArgumentTypeMismatchException.class)
	public ProblemDetail handleTypeMismatch(MethodArgumentTypeMismatchException exception) {
		ProblemDetail problemDetail = ProblemDetail.forStatus(HttpStatus.BAD_REQUEST);
		problemDetail.setTitle("Invalid request parameters");
		problemDetail.setDetail("Invalid value for parameter '" + exception.getName() + "'");
		return problemDetail;
	}
}
