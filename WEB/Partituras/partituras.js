document.addEventListener("DOMContentLoaded", () => {
  // ################################################################################ CONSTANTS
  const input = document.getElementById("input-content");
  const title = document.getElementById("piece-title");
  const output = document.getElementById("output-content");

  const save = document.getElementById("save");
  const select_pieces = document.getElementById("pieces");
  const load = document.getElementById("load");
  const remove = document.getElementById("remove");
  // const print = document.getElementById("print");
  const download = document.getElementById("download");

  let object_pieces = {};
  const regex = /[A-G@\(\)/|\.\+\-\;X_>,\{\}\[\]\=\*&\^%$\#\!<\?~]|(:.+:)/gm;

  // ################################################################################ INITIAL SETTINGS
  input.placeholder = `Sharp: #
    Upper: +
    Downer: -
    Non breaking space: _
    White space: .
    Medium space: | or /
    Long space: ~
    Line break: ;
    Horizontal line: @
    Hold: >
    Title: :[text goes here]:`.replaceAll(/ +/g, " ");

  refresh();

  // ################################################################################ HANDLE CHANGE
  input.oninput = (e) => {
    parsePiece(e.target.value);
  };

  // ################################################################################ SAVE
  save.onclick = () => {
    const tt = title.textContent;
    if (tt === null) {
      window.alert("Piece title cannot be empty!");
      return;
    }

    const str = cleanse(input.value);
    object_pieces[tt] = str;
    localStorage["partituras"] = JSON.stringify(object_pieces);
    refresh();
  };

  // ################################################################################ LOAD
  load.onclick = () => {
    const str = object_pieces[select_pieces.value]?.toString();
    input.value = str || "";
    parsePiece(str || "");
  };

  // ################################################################################ DELETE
  remove.onclick = () => {
    const val = select_pieces.value;
    if (!val) {
      window.alert("Piece is already empty!");
      return;
    }

    delete object_pieces[val];
    localStorage["partituras"] = JSON.stringify(object_pieces);
    refresh();
  };

  // ################################################################################ DOWNLOAD
  download.onclick = () => {
    const a = document.createElement("a");

    let arr = [];
    for (const piece in object_pieces)
      if (object_pieces[piece]) arr.push(object_pieces[piece] + "\n\n");

    // Create a blog object with the file content which you want to add to the file
    const file = new Blob(arr, { type: "text/plain" });

    const dd = new Date();
    const fill =
      dd.toDateString() +
      "-" +
      dd.getHours() +
      "_" +
      dd.getMinutes() +
      "_" +
      dd.getSeconds();

    // Add file content in the object URL
    a.href = URL.createObjectURL(file);
    a.download = `Partituras_${fill}.txt`;
    a.click();

    // Remove download
    URL.revokeObjectURL(a.href);
  };

  // ################################################################################ CLEANSE
  function cleanse(str = "") {
    str = str.toUpperCase();
    let cleansed = "";
    for (let match = regex.exec(str); match !== null; match = regex.exec(str))
      cleansed += match[0];
    return cleansed;
  }

  // ################################################################################ REFRESH
  function refresh() {
    object_pieces = JSON.parse(localStorage["partituras"] || "{}");

    select_pieces.replaceChildren();

    for (const piece in object_pieces) {
      const opt = document.createElement("option");
      opt.value = piece;
      opt.text = piece;
      select_pieces.appendChild(opt);
    }

    parsePiece(input.value);
  }

  // ################################################################################ PARSE PIECE
  function parsePiece(str = "") {
    str = str.toUpperCase();
    let up = 0;
    let sharp = false;
    let content = document.createDocumentFragment();
    title.textContent = "";

    for (let match = regex.exec(str); match !== null; match = regex.exec(str)) {
      const cc = match[0];

      if (cc.length > 1) {
        title.textContent += cc.slice(1, -1).toLowerCase();
        continue;
      }

      if (cc === "+") up++;
      else if (cc === "_") up--;
      else if (cc === "#") sharp = true;
      else {
        let el = document.createElement("span");
        el.textContent = cc;

        if (cc === ";") el = document.createElement("br");
        else if (cc === "@") el = document.createElement("hr");
        else if ("CDEFGAB".indexOf(cc) !== -1) {
          if (sharp) el.classList.add("sharp");
          if (up) {
            el.style.textDecoration = up > 0 ? "overline" : "underline";
            up = Math.abs(up);
            el.style.textDecorationStyle = up > 1 ? "double" : "solid";
          }
        } else {
          el.style.color = "red";

          if ("|/>".indexOf(cc) !== -1) el.style.width = "4rem";

          if (cc === ".") el.style.color = "transparent";
          else if (cc === "~") el.textContent = "…";
          else if (cc === "-") el.textContent = "―";
        }

        content.appendChild(el);
        sharp = false;
        up = 0;
      }
    }

    output.textContent = "";
    output.replaceChildren();
    output.appendChild(content);
  }
});

/*

:Tota-Sonata:
GA#A.D#FE#FAGD;+C+D+#D.+C+D+C+D#A+CG+C#F;GA#A.D#FE#FAGD;+G+F+#D+D-+F+#D+D+C#AAG#FG>;G#FGA-#AA#A+C-+D+#C+D+E-+#D+E+F+E-+F+#F+F+#F-+G>;+C#AAG#FG.#D#AA#A#FG>~@;GA#A>#AA#A/+C>A#A+C|AGA/#A;+D+F+#D.G#FG.+#D+DA>

:Distorsión - Main Theme:
#A>#G#FF#F#G.#C#D>>;F#F>#D#FF#F#G.+#C#A>>;#A>#G#FF#F#G.#C#D>>;+F#F>#D#FF#F#G.+#C#A>>@#FF#G/#F/F>;#FF#G/#A>@#DF#F#G#A.#AB+#C+#D.#G#A>;#D#A.#G#FF#F#G.#C_#A#D>;#DF#F#G#A.#AB+#C+#D.#G#A>;#D#A.#G#FF#F#G.+#C#G#A>@#DF#F#G#A.#G#A#D>;#DF#F#G.F#F+#C>+#C+#D#A;#DF#F#G#A.#G#A+#D>;+#D+#F+F.+#CG+#C#A>>@#DF#F#G#A/+#D/+F>+#F+#D>+F>

:Castlevania: Aria of Sorrow - Inner Quarters:
GG/#F#F/GG/GG;GG/#F#F/GG/#A#A@BAG#F>E#F>E#F>;G#FED>CD>_A_#A>@EE/#F#F/GG/AA;GG/#F#F/GG/#A#A@+D+C#AA>GA>GA>GA#A-+C+#DD;+G-+#A+A>+G+E>+C+#D>@+D+C#AA.G;+F+#D+#C+C.#A;+A+#G+#F+E.+D+#C>;+#D+F>F>

:The Levels - Aqua:
++D++C+A+E.+E.+E+#F+G/++D++C+A+E.+E.+E+CB;++D++C+A+E.+E.+E+#F+G/++D++C+A+E.+E.+E+CB;++D++C+A+E.+E.+E+#F+G/++D++C+A+E.+E.+E+CB@+#F/+E+F+#F-+E+#F/+E+F+#F-+E;+G/+E+F+G-+E+G/+E+F+G-+E;+B/+E+F+B-+E+B/+E+F+B-+E;++C/+E+F++C-+E++C/+E+F++C-+E@+#F/+E+F+#F-+E+#F/+E+F+#F-+E;+G/+E+F+G-+E+G/+E+F+G-+E;+B/+E+F+B-+E+B/+E+F+B-+E;++C/+E+F++C-+E++C/+E+F++C-+E;

:The Levels - Echo Woods:
+#F>+#C>+#F>+#C>;+#F+#C.+D+#F+#G+A|+#F+#C.+D+#F+#G+A;#F#C.D#F#GA|+#F+#C.+D+#F+#G+A;+#F>+#C>+#F>+#C>;#F>#C>#F>#C>@#F#C#F#C-#G#C#G#C-A#CA#C-#G#C#G#C;#F#C#F#C-#G#C#G#C-A#CA#C-#G#C#G#C;+#F+#C+#F+#C-+#G+#C+#G+#C-+A+#C+A+#C-+#G+#C+#G+#C;+#F+#C+#F+#C-+#G+#C+#G+#C-+A+#C+A+#C-+#G+#C+#G+#C@#C.#F#GA+#C|#C#F#G;D.#F#GA+D|D#F#G;#C.#F#GA+#C|#C#F#G;D.#F#GA+D|D#F#G.#C>@---#G>A#G>#F#G>-A#G#F>;D#FD#G>A#G>#F#G>DA#G#F>;#C#F#C#G/#CA#C#G/#C#F#C#G/#CA#G#F;D#FD#G/DAD#G/D#FD#G/DA#G#F>

:K.K: Nuevo Horizonte:
AF+D+C.AF.DG>;FGA+D.+E+F+C>;AF+D+C.AF.DG>;FGA+D.+E+F+C>;AF-+D+CAF-D>G>@A.F.+D.+C/FF>;+F+E+D+C/FF>;+F+E+D+E/AA>;#GAB+C.+E+A>;AF-+D+CAF-D>G>

:K.K: Agente Totakeke:
EE.#FGAB.BAGB>;EE.#FGAB.BAGA-B+DB-GA>@AB+C/+CB+C+D+E/+E#F-+E+D.AB>;--+C/+CB+C+D+E/+E+#F-+#F+G+#F>;+#F+G+#F-+D+E>

:K.K: Vagabundo:
+E+E+E+D+C|+A+A+A+G+F;+E+E+E+F+G-+A+G/+F+G>;+E+E+E+D+C|+A+A+A+G+F;+E+E+E+F+E-+D+C.A+D+C.AG-AB+C>

:M&L: B.I.S. - Deep Castle:
+#C>+#DE+#F.+E+#D+#C>;BA>#GA>#F-#G>E>#D>@#C#DE#F#G.#FE#F.E#DE.#D#C#D.#CC#C.E_#G>;(+E+#F+#D)@#C#DE#FE.#D#C/C#C#G#C;C#C#DE#F.E#D#C.#D#CC>@#C#DE#F#G.#FE#F.E#DE.#D#C#D.#CC#C.E_#G>;(+E+#F+#D)@#C#DE#FE.#DF>E#DE#D;#C#DE#F#G.#FE#F.E#DE#D.#C>

:Castlevania: Aria Of Sorrow - Top Floor:
#G>.#FE#D#CE-_AE>#F;#G>+#C+#D+E+#D+#CB-EB>;+D>.+C#AAG#A-#D#A>+#C@A>#A/G/A>+D/+#C;A>#A/G/A>D>@GG-+F+F-+G+G.GG-+F+F-+G+G;++D++D++D++D-+G+G.++D++D++D++D-+G+G;GG-+F+F-+G+G.GG-+F+F-+G+G;++D++D++D++D-+G+G.++D++D++D++D-+G+G@+D>.+C#AAG#A-#D#A>+C;+D>+G+A+#A+A+G+F-#A+F>+G@A.B.+C|G+C>+D+#D;+D+#D-#A+#D+#F-#A+#D#A+#D-+F+#F;+#C+#F-A+#C+#F-A+#C+#F-GB;++C+A+E+C|+E+CAE>

:Castlevania: Aria Of Sorrow - Study:
G>AB>+C+D+E>+D+#C>+#D>;+EB+#F/+G-+A+G+#F+E-+G+#F.B+B>;+A+G-+B+A+G+#F-+A+G+#F+E-+G+#F.B+B>;++C/+A/+B/+G/+A/+G+#F+E-+G+#F@+A+#A++C-+#A+D+A/+#A-++C+#A+A+G-+#A+A.+D++D>;++C+#A-++D++C+#A+A-++C+#A+A+G-+#A+A.+D-++D++C+#A.+G+#F+G;++#D++D++C+#A+A.+F+E+F|++D++C+#A+A+G.+#D+D+#D;++C+#A+A+G-+A+G+E+#F>+D>@#AAGA#AAG.#AB#A#G-#AB#AB#G;AB+C+D+E-+CBA|#A+C+#C+C-#A+C+#C+#D;+D+#CB+#C+D+#CB.+D+#D+D+C-+D+#D+D+#D+C;+#C+#D+E+#F+#G>+C+#C+#D-+E+#F+E+#F+#D/+E+#G>@+C>+#C#G+#D/+E-+#F+E+#D+#C-+E+#D.#G#G>C>;+#G+#F+F+#D+#C-+F+#F+#G.+A+#F+#D+#CB-+#D+E+#F;+#G+E+#CBA-+#C+#D+E.+E+#D+#C+E+#D-+#F+G+A@+GB+#F/+G-+A+G+#F+E-+G+#F.B+B>;+A+G-+B+A+G+#F-+A+G+#F+E-+G+#F.B-+B+A+G.+E+#D+E;++C+B+A+G+#F-+D+#C+D.+B+A+G+#F+E-+CB+C;+A+G+#F+E-+#F+E+#C+#D>B@+E.+E.+E+#F>+#F+G+#A-+G+E.+#A>+#A+B>+B+#A+B>

:Castlevania: Aria Of Sorrow - Underground Reservoir:
+#C+#D+E-+#G+#F.+E+#D+#C+E-A+E>;+F+C#G.#AB#AB+C>;#GE#F#G-BA.#G#FE#D-_#G#D>;B.EB>+CFF.F#F#F.+#C#F@BGBGBG-+#CA+#C+#C.+#C.+DB+DB+DB-+#C#A+#C+#C.+#C;+G+E+G+E+G+E-+A+#F+A+A.+A.+#A+G+#A+G+#A+G-++#C+#A++#C++#C.++#C@B.AB-GA-#FG-E>B.AB-GA-#FG-B>;B.AB-GA-#FG-E>+C.#A+C-#G#A-G#G-+C>@+C#G+C#G+C#G-+D#A+D+D#A+D.+#D+C+#D+C+#D+C-+#F+#D+#F+#F+#D+#F;+C#G+C#G+C#G-+D#A+D+D#A+D.+#DB+#DB+#DB-+F+D+F+F+D+F@+#A.+#G+#A-+#F+#G-+F+#F-+#D>+#A.+#G+#A-+#F+#G-+F+#F-#A>;+#D.+#C+#D-B+#C-#AB-#G.#F#F#G-F.#D#DF;+B.+A+B-+G+A-+#F+G-+E>+B.+A+B-+G+A-+#F+G-B>;+E.+D+E-+C+D-BC-A.GGA-#F.EE#D@#G>.#G#G+#C.+#G>

*/
