/**
 * Copyright 2023-2023 Ghent University
 *
 * This file is part of vsc_user_docs,
 * originally created by the HPC team of Ghent University (http://ugent.be/hpc/en),
 * with support of Ghent University (http://ugent.be/hpc),
 * the Flemish Supercomputer Centre (VSC) (https://www.vscentrum.be),
 * the Flemish Research Foundation (FWO) (http://www.fwo.be/en)
 * and the Department of Economy, Science and Innovation (EWI) (http://www.ewi-vlaanderen.be/en).
 *
 * https://github.com/hpcugent/vsc_user_docs
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 * @author: Michiel Lachaert
 */

/**
 * A function that populates the table on the module overview page with information about all the available modules.
 */
function populate_overview(json_data) {
    fetch(json_data)
        .then((response) => response.json())
        .then((json) => {
            // Set generated time
            const p = document.getElementById("time")
            p.innerText = `This data was automatically generated ${json.time_generated}`


            // CONSTRUCT TABLE

            // list with all the names of the targets
            const t1 = json.targets.map(x => {
		    //Todo: split up the strings of the targets to automate the hierarchy of the table header
		    let pathArray = x.split("/")
		    //pathArray = pathArray.slice(7)
		    console.log("pathArray:", pathArray)
		    console.log("last:", pathArray[pathArray.length -1])
		    x = pathArray[pathArray.length -1]
		    //x = pathArray
		    console.log("x:",x)
                    return ({"title": x})
                })
            const all_targets = [ "", ...t1 ]
	    console.log("all_targets2",all_targets)

            const tableElement = document.querySelector('#overview_table');
            console.log('Table element:', tableElement);
            if (!tableElement) {
               console.error('#overview_table, Table element not found!');
            }

            if (!Array.isArray(all_targets)) {
               console.error('all_targets is not an array!');
            } else {
               all_targets.forEach((target, index) => {
                  if (typeof target !== 'object' || !target.hasOwnProperty('title')) {
                     console.error(`Invalid target at index ${index}:`, target);
                  }
               });
            }
            console.log("all_targets", all_targets)
            console.log([{"title": "Name"}, ...all_targets])
            try {
              const table = new DataTable('#overview_table', {
	         columns: all_targets,
                 paging: false,
                 columnDefs: [
                   {
                       targets: "_all",
                       className: 'dt-body-center'
                   }
                 ]
              });
              console.log("table:", table)

              // ADD DATA
              let new_rows = [];

              // list_avaible contains a list with booleans.
              // These booleans indicates if the software is available on the corresponding cluster.
              for (const [software, list_available] of Object.entries(json.modules)) {
                  let new_row = [`<a href="../detail/${software}">${software}</a>`];
                  list_available.forEach(bool => new_row.push(bool ? "x" : "-"));
                  new_rows.push(new_row);
              }

              table.rows.add(new_rows).draw();
            } catch (error) {
              console.error('Error initializing DataTable:', error);
            }
        })
}

// Only start populating the table if the correct page has been loaded.
document$.subscribe(function() {
    if (document.getElementById("overview_table")) {
        populate_overview("../data/json_data.json")
    }
})
