Narwhal XPCShell / XULRunner
============================

Setup
-----

    git clone git://github.com/tlrobinson/narwhal.git narwhal
    cd narwhal/engines
    git clone git://github.com/Gozala/narwhal-xulrunner.git xulrunner
    git clone git://github.com/zaach/narwhal-xpcshell.git xpcshell
    cd xpcshell
    bin/install
    cd ../..
    NARWHAL_PLATFORM=xpcshell bin/narwhal
