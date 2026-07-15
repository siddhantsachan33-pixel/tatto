import React from 'react';

export default function ComparisonTable() {
  return (
    <section className="section-padding" id="why-choose-us" style={{ background: '#fafafa' }}>
      <div className="container">
        <div className="section-header">
          <p className="section-subtitle">How it compares</p>
          <h2 className="section-title">The Ink Comparison</h2>
        </div>

        <div className="comparison-container animate-fade-in">
          <table className="comp-table">
            <thead>
              <tr>
                <th>Feature</th>
                <th style={{ background: 'rgba(212, 175, 55, 0.08)' }}>INKUP Tattoos</th>
                <th>Standard Stickers</th>
                <th>Permanent Ink</th>
              </tr>
            </thead>
            <tbody>
              <tr className="highlighted">
                <td className="comp-feature">Longevity</td>
                <td><span className="comp-badge green">1 - 2 Weeks</span></td>
                <td><span className="comp-badge red">1 - 2 Days</span></td>
                <td><span className="comp-badge gray">Lifetime</span></td>
              </tr>
              <tr>
                <td className="comp-feature">Pain Level</td>
                <td><span className="comp-badge green">Zero Pain</span></td>
                <td><span className="comp-badge green">Zero Pain</span></td>
                <td><span className="comp-badge red">High (Needles)</span></td>
              </tr>
              <tr className="highlighted">
                <td className="comp-feature">Appearance</td>
                <td><span className="comp-badge green">Looks 100% Real</span></td>
                <td><span className="comp-badge red">Shiny & Fake</span></td>
                <td><span className="comp-badge green">Real</span></td>
              </tr>
              <tr>
                <td className="comp-feature">Skin Safety</td>
                <td><span className="comp-badge green">Organic (Skin-Safe)</span></td>
                <td><span className="comp-badge red">Synthetic Glues</span></td>
                <td><span className="comp-badge gray">Inks & Metals</span></td>
              </tr>
              <tr className="highlighted">
                <td className="comp-feature">Commitment</td>
                <td><span className="comp-badge green">No Regrets (Fades)</span></td>
                <td><span className="comp-badge green">No Regrets</span></td>
                <td><span className="comp-badge red">Permanent</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}
