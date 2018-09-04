module.exports = function(string) {
  if (!string) return NaN;
  if (typeof string === 'number') return string;
  string = string.replace(/(\s|\.)/g, '').replace(/,/g, '.');
  return parseFloat(string);
}
