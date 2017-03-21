/**
 * Simhash class. Creates a 32-bit simhash.
 *
 * // Usage:
 * var hash = Simhash.of("This is a test");
 *
 * // Override default values
 * var simhash = new Simhash();
 * var hash = simhash.of("This is a test", {
 *      kshingles: 2,
 *      maxFeatures: 32
 * });
 */



function(page)
{
  //simhash.js license see https://github.com/vkandy/simhash-js
 var Simhash = function(options) {
     /**
      * By default, we tokenize input into chunks of this size.
      */
     var kshingles = typeof(options) != 'undefined' && typeof(options['kshingles']) != 'undefined' ? options['kshingles'] : 4;

     /**
      * By default, this many number of minimum shingles will
      * be combined to create the final hash.
      */
     var maxFeatures = typeof(options) != 'undefined' && typeof(options['maxFeatures']) != 'undefined' ? options['maxFeatures'] : 128;

     // --------------------------------------------------
     // Public access
     // --------------------------------------------------

     /**
      * Driver function.
      */
     this.of = function(input, options) {
         var tokens = tokenize(input);
         var shingles = [];
         var jenkins = new Jenkins();
         for(var i in tokens) {
             shingles.push(jenkins.hash32(tokens[i]));
         }
         var simhash = combineShingles(shingles);
         simhash >>>= 0;
         return simhash;
     };

     // --------------------------------------------------
     // Private methods
     // --------------------------------------------------

     /**
      * TODO: Make this private or take closure that implements
      * logic to combine shingles.
      */
     var combineShingles = function(shingles) {
         if(shingles.length == 0) return;

         if(shingles.length == 1) return shingles[0];

         shingles.sort(hashComparator);
         if(shingles.length > maxFeatures) shingles = shingles.splice(maxFeatures);

         var simhash = 0x0;
         var mask = 0x1;
         var shingle = 0;
         for(var pos = 0; pos < 32; pos++) {
             var weight = 0;
             for(var i in shingles) {
                 shingle = parseInt(shingles[i],16);
                 weight += !(~shingle & mask) == 1 ? 1 : -1;
             }
             if(weight > 0) simhash |= mask;
             mask <<= 1;
         }

         return simhash;
     };

     /**
      * Tokenizes input into 'kshingles' number of tokens.
      */
     var tokenize = function(original) {
         var size = original.length;
         if(size <= kshingles) {
             return [original.substr(0)];
         }

         var shingles = [];
         for (var i = 0; i < size; i = i + kshingles) {
             shingles.push(i + kshingles < size ? original.slice(i, i + kshingles) : original.slice(i));
         }
         return shingles;
     };

     /**
      * Calculates binary hamming distance of two base 16 integers.
      */
     var hammingDistanceSlow = function(x, y) {
         var distance = 0;
         var val = parseInt(x, 16) ^ parseInt(y, 16);
         while(val) {
             ++distance;
             val &= val - 1;
         }
         return distance;
     };

     /**
      * Calculates binary hamming distance of two base 16 integers.
      */
     var hammingDistance = function(x, y) {
         var a1 = parseInt(x, 16);
         var a2 = parseInt(y, 16);
 	    var v1 = a1^a2;
 	    var v2 = (a1^a2)>>32;

 	    v1 = v1 - ((v1>>1) & 0x55555555);
 	    v2 = v2 - ((v2>>1) & 0x55555555);
 	    v1 = (v1 & 0x33333333) + ((v1>>2) & 0x33333333);
 	    v2 = (v2 & 0x33333333) + ((v2>>2) & 0x33333333);
 	    var c1 = ((v1 + (v1>>4) & 0xF0F0F0F) * 0x1010101) >> 24;
 	    var c2 = ((v2 + (v2>>4) & 0xF0F0F0F) * 0x1010101) >> 24;

 	    return c1 + c2;
     };

     /**
      * Calculates bit-wise similarity - Jaccard index.
      */
     this.similarity = function(x, y) {
         var x16 = parseInt(x, 16);
         var y16 = parseInt(y, 16);
         var i = (x16 & y16);
         var u = (x16 | y16);
         return hammingWeight(i) / hammingWeight(u);
     };



     /**
      * Calculates Hamming weight (population count).
      */
     var hammingWeight = function(l) {
         var c;
         for(c = 0; l; c++) l &= l-1;
         return c;
     };

     /**
      * TODO: Use a priority queue. Till then this comparator is
      * used to find the least 'maxFeatures' shingles.
      */
     var hashComparator = function(a, b) {
         return a < b ? -1 : (a > b ? 1 : 0);
     };
 };

 /**
  * Jenkins hash implementation which yeilds 32-bit and 64-bit hashes.
  *
  * See https://github.com/vkandy/jenkins-hash-js
  */
 var Jenkins = function() {
     /**
      * Default first initial seed.
      */
     var pc = 0;

     /**
      * Default second initial seed.
      */
     var pb = 0;

     // --------------------------------------------------
     // Public access
     // --------------------------------------------------

     /**
      * Computes and returns 32-bit hash of given message.
      */
     this.hash32 = function(msg) {
         var h = lookup3(msg, pc, pb);
         return (h.c).toString(16);
     };

     /**
      * Computes and returns 32-bit hash of given message.
      */
     this.hash64 = function(msg) {
         var h = lookup3(msg, pc, pb);
         return (h.b).toString(16) + (h.c).toString(16);
     };

     // --------------------------------------------------
     // Private methods
     // --------------------------------------------------

     /**
      * Implementation of lookup3 algorithm.
      */
     var lookup3 = function(k, pc, pb) {
         var length = k.length;
         var a, b, c;
         var mixed = "";

         a = b = c = 0xdeadbeef + length + pc;
         c += pb;

         var offset = 0;
         while (length > 12) {
             a += k[offset + 0];
             a += k[offset + 1] << 8;
             a += k[offset + 2] << 16;
             a += k[offset + 3] << 24;

             b += k[offset + 4];
             b += k[offset + 5] << 8;
             b += k[offset + 6] << 16;
             b += k[offset + 7] << 24;

             c += k[offset + 8];
             c += k[offset + 9] << 8;
             c += k[offset + 10] << 16;
             c += k[offset + 11] << 24;

             mixed = mix(a, b, c);
             a = mixed.a;
             b = mixed.b;
             c = mixed.c;

             length -= 12;
             offset += 12;
         }

         switch (length) {
             case 12: c += k[offset + 11] << 24;
             case 11: c += k[offset + 10] << 16;
             case 10: c += k[offset + 9] << 8;
             case 9: c += k[offset + 8];

             case 8: b += k[offset + 7] << 24;
             case 7: b += k[offset + 6] << 16;
             case 6: b += k[offset + 5] << 8;
             case 5: b += k[offset + 4];

             case 4: a += k[offset + 3] << 24;
             case 3: a += k[offset + 2] << 16;
             case 2: a += k[offset + 1] << 8;
             case 1: a += k[offset + 0]; break;

             case 0: return {c: c >>> 0, b: b >>> 0};
         }

         // Final mixing of three 32-bit values in to c
         mixed = finalMix(a, b, c)
         a = mixed.a;
         b = mixed.b;
         c = mixed.c;

         return {c: c >>> 0, b: b >>> 0};
     };

     /**
      * Mixes 3 32-bit integers reversibly but fast.
      */
     var mix = function(a, b, c) {
         a -= c; a ^= rot(c, 4); c += b;
         b -= a; b ^= rot(a, 6); a += c;
         c -= b; c ^= rot(b, 8); b += a;
         a -= c; a ^= rot(c, 16); c += b;
         b -= a; b ^= rot(a, 19); a += c;
         c -= b; c ^= rot(b, 4); b += a;
         return {a : a, b : b, c: c};
     };

     /**
      * Final mixing of 3 32-bit values (a,b,c) into c
      */
     var finalMix = function(a, b, c) {
         c ^= b; c -= rot(b, 14);
         a ^= c; a -= rot(c, 11);
         b ^= a; b -= rot(a, 25);
         c ^= b; c -= rot(b, 16);
         a ^= c; a -= rot(c, 4);
         b ^= a; b -= rot(a, 14);
         c ^= b; c -= rot(b, 24);
         return {a : a, b : b, c: c};
     };

     /**
      * Rotate x by k distance.
      */
     var rot = function(x, k) {
         return (((x) << (k)) | ((x) >> (32-(k))));
     };
 };

  var Sh = new Simhash();

  //double body parse all the way
  //because body.innerText tends to return HTML nontheless
  var parser = new DOMParser();
  var idle_text = parser.parseFromString(page.getIdleDom().body.innerText, "text/html").body.innerText;
  var static_text = parser.parseFromString(page.getStaticDom().body.innerText, "text/html").body.innerText;

  console.log('hi');
  console.log(idle_text);
  console.log(static_text);                     //skfhjdsjfd
  if(idle_text && static_text)
  {
    console.log('hiho');
    var diff = Sh.similarity(Sh.of(static_text),Sh.of(idle_text));
    var diff_p = Math.round(diff*100).toFixed(2);
    return this.createResult('BODY', "Diff. static text / idle_text: "+diff_p+" ("+diff+")", 'info');
  }
  return null;
  var doc = parser.parseFromString(dom.body.innerText, "text/html");
}
