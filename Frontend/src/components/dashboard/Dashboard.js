import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css'; // Додамо CSS файл для стилів

const Dashboard = () => {
  // Динамічні сторінки, які можна редагувати
  const dynamicPages = [
    { 
      name: 'Галерея', 
      path: 'gallery', 
      description: 'Редагування галереї фото та відео', 
      icon: '🖼️', 
      color: '#e74c3c' 
    }
  ];

  // Картки керування контентом
  const contentManagementCards = [
    {
      name: 'Керування новинами',
      path: '/admin/news',
      description: 'Створення, редагування та публікація новин школи',
      icon: '📰',
      color: '#9b59b6',
      badge: '⚙️ Повне управління',
      badgeColor: '#f4ecf7',
      textColor: '#8e44ad'
    },
    {
      name: 'Керування галереєю',
      path: '/admin/gallery-management',
      description: 'Додавання, редагування та видалення фото у галереї',
      icon: '🖼️',
      color: '#e74c3c',
      badge: '📸 Управління фото',
      badgeColor: '#fdedec',
      textColor: '#c0392b'
    },
    {
      name: 'Прозорість та документи',
      path: '/admin/transparency',
      description: 'Управління документами прозорості, статутом та звітністю',
      icon: '📊',
      color: '#3498db',
      badge: '📄 Документи',
      badgeColor: '#e7f3ff',
      textColor: '#004085'
    }
  ];

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <a 
          href="/site/home" 
          target="_blank"
          rel="noopener noreferrer"
          className="preview-button"
        >
          👁️ Перегляд сайту
        </a>
      </div>

      {/* Секція керування контентом */}
      <div className="dashboard-section">
        <h2 className="section-title section-title-purple">
          Керування контентом
        </h2>
        <div className="cards-grid">
          {contentManagementCards.map((card, idx) => (
            <Link
              key={card.path}
              to={card.path}
              className={`content-management-card variant-${idx}`}
              style={{ borderColor: card.color }}
            >
              {/* Variant 0: Large media-style card with CTA */}
              {idx === 0 && (
                <div className="card-media">
                  <div className="media-left" style={{ background: `linear-gradient(135deg, ${card.color}, #ffffff22)` }}>
                    <div className="media-icon">{card.icon}</div>
                  </div>
                  <div className="media-body">
                    <h3 className="card-title">{card.name}</h3>
                    <p className="card-description">{card.description}</p>
                    <div className="card-actions">
                      <span className="action-btn primary">{card.badge}</span>
                      <span className="action-btn muted">Переглянути список</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Variant 1: Gallery-style tile with framed icon */}
              {idx === 1 && (
                <div className="card-gallery">
                  <div className="gallery-frame">
                    <div className="gallery-icon">{card.icon}</div>
                  </div>
                  <div className="gallery-body">
                    <h3 className="card-title">{card.name}</h3>
                    <p className="card-description">{card.description}</p>
                    <div className="card-actions">
                      <span className="action-btn photo">{card.badge}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Variant 2: Minimal document card with bullets */}
              {idx === 2 && (
                <div className="card-docs">
                  <div className="doc-head">
                    <h3 className="card-title">{card.name}</h3>
                    <span className="card-icon small">{card.icon}</span>
                  </div>
                  <p className="card-description">{card.description}</p>
                  <ul className="doc-list">
                    <li>📄 Статут та політики</li>
                    <li>📊 Звіти за рік</li>
                    <li>🔒 Архів документів</li>
                  </ul>
                  <div className="card-actions">
                    <span className="action-btn docs">{card.badge}</span>
                  </div>
                </div>
              )}
            </Link>
          ))}
        </div>
      </div>

      {/* Статистика та швидкі дії */}
      <div className="dashboard-stats">
        <div className="stats-card">
          <h3 className="stats-title">Швидкі дії</h3>
          <div className="quick-actions">
            <Link to="/admin/news/create" className="quick-action-btn primary">
              Додати новину
            </Link>
            <Link to="/admin/transparency" className="quick-action-btn secondary">
              Редагувати прозорість
            </Link>
            <Link to="/admin/gallery-management" className="quick-action-btn secondary">
              Керувати галереєю
            </Link>
          </div>
        </div>
        
        <div className="info-card">
          <h3 className="info-title">ℹ️ Інформація</h3>
          <p className="info-text">
            <strong>Статичні сторінки</strong> (Головна, Про нас, Відділи, Контакти) не редагуються через адмін-панель 
            та мають фіксований вміст. Для їх зміни потрібно редагувати код напряму.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;