function Stack(size) {

  this.stack = new Array();
  this.size = size;

  this.pop = function () {
    if (this.stack.length == 0) {
      throw "Stack underflow."
    }
    return this.stack.pop();
  }

  this.push = function (data) {
    if (this.stack.length == this.size) {
      throw "Stack overflow."
    }
    return this.stack.push(data);
  }
} 
