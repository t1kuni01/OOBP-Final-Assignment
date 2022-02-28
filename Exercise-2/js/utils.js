// THIS FILE CONTAINS GENERAL PURPOSE FUNCTIONS AND OBJECTS

HTMLElement.prototype.removeClass = function(classToRemove) { 
    var newClassName = "";
    var classList = this.className.split(" "); 
    for (var i = 0; i < classList.length; i++) {
        if (classList[i] !== classToRemove) {
            newClassName += classList[i] + " ";
        }
    }
    this.className = newClassName;
};

HTMLElement.prototype.addClass = function(classToAdd) { 
    this.className += " " + classToAdd;
};

HTMLElement.prototype.hasClass = function(classToCheck) {
    var classList = this.className.split(" ");
    for (var i = 0; i < classList.length; i++) {
        if (classList[i] == classToCheck) {
            return true;
        }
    }
    return false;
};

String.prototype.toUpperCaseFirstChar = function() { 
    return (this.charAt(0).toUpperCase() + this.slice(1)).toString();
}

var preventParentEvent = function(e) {
    if (!e) var e = window.event;
    e.cancelBubble = true;
    if (e.stopPropagation) e.stopPropagation(); 
}

var Storage = {
	LSCompatible: function() {
		if (window.localStorage !== undefined) { 
			return true;
		} else {
			return false;
		} 
	},
	setItem: function(key, value) {
		if (this.LSCompatible()) {
			localStorage.setItem(key, value); 
		} else {
            document.cookie = key + "=" + value + "; " + "expires=Fri, 31 Dec 9999 23:59:59 GMT"; 
		}
	},
	getItem: function(key) {
		if (this.LSCompatible()) {
			return localStorage.getItem(key); 
		} else { 
            var name = key + "=";
            var cookieParts = document.cookie.split(";");
            for (var i = 0; i < cookieParts.length; i++) {
                var c = cookieParts[i];
                while (c.charAt(0) == " ") c = c.substring(1);
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return false;
		}
	}
};

function checkInput(value, minLength, maxLength, invalidChars, lengthFunc, invalidFunc, successFunc) { 
    var hasInvalidError = false,
        hasLengthError = false;
    if (value.length < minLength || value.length > maxLength) {
        if (lengthFunc) lengthFunc();
        hasLengthError = true;
    }
    if (invalidChars) {
        for (var i = 0; i < invalidChars.length; i++) {
            if (!hasInvalidError) {
                for (var v = 0; v < value.length; v++) {
                    if (value[v] == invalidChars[i]) {
                        if (invalidFunc) invalidFunc();
                        hasInvalidError = true;
                        break;
                    }
                }
            }
        }
    }
    if (!hasLengthError && !hasInvalidError) {
        if (successFunc) successFunc();
    }
}

function checkEmailFormat(emailAddress, invalidFunc) { 
    var invalidChars = "!#$%^&*()-+''~?{}[]:;<>,``/=";
	for (var i = 0; i < emailAddress.length; i++) {
		for (var j = 0; j < invalidChars.length; j++) {
			if (emailAddress[i] == invalidChars[j]) {
				invalidFunc();
				return;	
			}
		}
	}
	
	var atParts = emailAddress.split("@");
    if (atParts.length != 2) {
        invalidFunc();
        return;
    } else {
        if (!atParts[0].length || !atParts[1].length) {
            invalidFunc();
            return;
        }
        for (var a = 0; a < atParts.length; a++) {
            if (atParts[a].charAt(0) == "." || atParts[a].charAt(atParts[a].length - 1) == ".") {
                invalidFunc();
                return;
            }
            var prevChar = null;
            for (var i = 0; i < atParts[a].length; i++) {
                var char = atParts[a][i];
                if (i == 0) {
                    prevChar = char;
                } else {
                    if (char == "." && prevChar == ".") {
                        invalidFunc();
                        return;
                    } else {
                        prevChar = char;
                    }
                }
            }
        }
    }
}
