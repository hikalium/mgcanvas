
SRCDIR	= src/
SRCS	= core/ext.ts core/extcanvas.ts core/mgcanvas.ts core/mgdb.ts \
			 core/mgedge.ts core/mgnode.ts core/rectangle.ts core/uuid.ts \
			 core/vector2d.ts core/window.ts core/canvasui.ts
FULLSRCS	= $(addprefix $(SRCDIR),$(SRCS))

default: Makefile
	make ./www/mgcanvas.min.js
	
clean:
	rm ./www/mgcanvas.min.js
	rm mgcanvas.js

mgcanvas.js: $(FULLSRCS) Makefile
	tsc --noImplicitAny --out mgcanvas.js $(FULLSRCS)

./www/mgcanvas.min.js: mgcanvas.js Makefile
#	node ./tool/minimize.js	
	cp mgcanvas.js ./www/mgcanvas.min.js