REM
REM Copyright 2004 Sun Microsystems, Inc. All rights reserved.
REM SUN PROPRIETARY/CONFIDENTIAL. Use is subject to license terms.
REM

rem ---------------------------------------------------------------------------
rem User configurable settings
rem
rem Set configurable environment variables. By default, they are just unset.
rem These values must be set in this file as they are not inherited from the
rem shell.
rem
rem Note for Win98 and WinME users:
rem All paths must be use the short path name only i.e. the "8.3" format of
rem for the path. The long path name may cause unexpected results.
rem
rem $Id: setenv.bat,v 1.14 2004/03/30 23:27:52 ofung Exp $
rem ---------------------------------------------------------------------------

rem Warning: Donot change value of JWSDP_HOME property. Specially donot update that
rem to have value with quotes (")

set JAVA_HOME=C:\Tools\Java\j2sdk1.4.2_12
set ANT_HOME=C:\Tools\Java\jwsdp-1.4\apache-ant
set ANT_OPTS=-Djava.endorsed.dirs=C:\Tools\Java\jwsdp-1.4\jaxp\lib\endorsed
set JWSDP_HOME=C:\Tools\Java\jwsdp-1.4
