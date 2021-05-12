function HandleMatchRegex(name, regex, message) {
  let regexBoolean = regex.test(name);
  return { value: regexBoolean, message };
}

export default HandleMatchRegex;
