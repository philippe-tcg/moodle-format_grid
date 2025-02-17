YUI.add('event-nav-keys', function(Y) {

var keys = {
        enter    : 13,
        esc      : 27,
        backspace: 8,
        tab      : 9,
        pageUp   : 33,
        pageDown : 34,
        left     : 37,
        up       : 38,
        right    : 39,
        down     : 40,
        space    : 32
    };

Y.Object.each(keys, function (keyCode, name) {
    Y.Event.define({
        type: name,

        on: function (node, sub, notifier, filter) {
            var method = (filter) ? 'delegate' : 'on';

            sub._handle = node[method]('keydown', function (e) {
                if (e.keyCode === keyCode) {
                    notifier.fire(e);
                }
            }, filter);
        },

        delegate: function () {
            this.on.apply(this, arguments);
        },

        detach: function (node, sub) {
            sub._handle.detach();
        },

        detachDelegate: function () {
            this.detach.apply(this, arguments);
        }
    });
});


}, '2011.02.02-21-07' ,{requires:['event-synthetic']});
YUI.add('moodle-format_grid-gridkeys', function (Y, NAME) {

// This file is part of Moodle - http://moodle.org/
//
// Moodle is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.
//
// Moodle is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.
//
// You should have received a copy of the GNU General Public License
// along with Moodle.  If not, see <http://www.gnu.org/licenses/>.

/**
 * Grid Format - A topics based format that uses a grid of user selectable images to popup a light box of the section.
 *
 * @package    course/format
 * @subpackage grid
 * @copyright  &copy; 2013 onwards G J Barnard in respect to modifications of standard topics format.
 * @author     G J Barnard - gjbarnard at gmail dot com and {@link http://moodle.org/user/profile.php?id=442195}
 * @license    http://www.gnu.org/copyleft/gpl.html GNU GPL v3 or later
 */

M.format_grid = M.format_grid || {};
M.format_grid.gridkeys = M.format_grid.gridkeys || {};
M.format_grid.gridkeys = {
    currentGridBox: false,
    currentGridBoxIndex: 0,
    findfocused: function() {
        var focused = document.activeElement;
        if (!focused || focused == document.body) {
            focused = null;
        } else if (document.querySelector) {
            focused = document.querySelector(":focus");
        }
        M.format_grid.gridkeys.currentGridBox = false;
        if (focused && focused.id) {
            if (focused.id.indexOf('gridsection-') > -1) {
                M.format_grid.gridkeys.currentGridBox = true;
                M.format_grid.gridkeys.currentGridBoxIndex = parseInt(focused.id.replace("gridsection-", ""));
            }
        }
        return M.format_grid.gridkeys.currentGridBox;
    },
    init: function(params) {
        //console.log(JSON.stringify(params));
        if (!params.editing) {
            Y.on('esc', function (e) {
                e.preventDefault();
                M.format_grid.icon_toggle(e);
            });
            // Initiated in CONTRIB-3240...
            Y.on('enter', function (e) {
                if (M.format_grid.gridkeys.currentGridBox) {
                    e.preventDefault();
                    if (M.format_grid.shadebox.shadebox_open === false) {
                        M.format_grid.icon_toggle(e);
                    } else if (e.shiftKey) {
                        M.format_grid.icon_toggle(e);
                    }
                }
            });
            Y.on('tab', function (/*e*/) {
                //e.preventDefault();
                //window.dispatchEvent(e);
                setTimeout(function() {
                    // Cope with the fact that the default event happens after us.
                    // Therefore we need to react after focus has moved.
                    if (M.format_grid.gridkeys.findfocused()) {
                        //e.preventDefault();
                        M.format_grid.tab(M.format_grid.gridkeys.currentGridBoxIndex);
                    /*
                    if (e.shiftKey) {
                        M.format_grid.arrow_left(e);
                    } else {
                        M.format_grid.arrow_right(e);
                    }
                    */
                    }
                }, 250);
            });
            Y.on('space', function (e) {
                /*
                var focused = document.activeElement;
                if (!focused || focused == document.body) {
                    focused = null;
                } else if (document.querySelector) {
                    focused = document.querySelector(":focus");
                }
                if (focused.id) {
                    if (focused.id.indexOf('gridsection-') > -1) {
                    }
                }
                */
                if (M.format_grid.gridkeys.currentGridBox) {
                    e.preventDefault();
                    M.format_grid.icon_toggle(e);
                }
            });
        }
        Y.on('left', function (e) {
            e.preventDefault();
            M.format_grid.arrow_left(e);
        });
        Y.on('right', function (e) {
            e.preventDefault();
            M.format_grid.arrow_right(e);
        });
    }
};

}, '@VERSION@', {"requires": ["event-nav-keys"]});
