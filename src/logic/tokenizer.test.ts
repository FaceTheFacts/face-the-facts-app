import {makeToken} from './tokenizer';

// Testing the tokenizer function
it('given a string, tokenizer returns a tokenized string', () => {
  expect(makeToken('Lindner')).toBe('indner');
});

it('given a l, tokenizer returns an i', () => {
  expect(makeToken('l')).toBe('i');
});

it('given a ß, tokenizer returns a b', () => {
  expect(makeToken('ß')).toBe('b');
});

it('given a ü, tokenizer returns a u', () => {
  expect(makeToken('ü')).toBe('u');
});

it('give an empty string, tokenizer returns an empty string', () => {
  expect(makeToken('')).toBe('');
});

it('give a string containing a space, tokenizer returns an empty string', () => {
  expect(makeToken(' ')).toBe('');
});

it('give a string containing a dot, tokenizer returns a string without dot', () => {
  expect(makeToken('a.b')).toBe('ab');
});

it('give a string containing a comma, tokenizer returns a string without comma', () => {
  expect(makeToken('a,b')).toBe('ab');
});

it('give a capitalised string, tokenizer returns only lowerCases', () => {
  expect(makeToken('ABC')).toBe('abc');
});

it('given a string containing a number, tokenizer returns a string without number', () => {
  expect(makeToken('a1b')).toBe('ab');
});
